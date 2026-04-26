#!/usr/bin/env python3
"""Build global atomic-tasks.json graph from per-feature decompositions."""
import json, sys, pathlib, datetime

ROOT = pathlib.Path("/Users/insafismath/Desktop/Work_Projects/insaf-website")
DECOMP = ROOT / ".claude/product/intermediate-decompositions.json"
FBO = ROOT / ".claude/product/feature-build-order.json"
ARCH = ROOT / ".claude/product/architecture.json"
OUT = ROOT / ".claude/product/atomic-tasks-insafismath-com.json.draft"

decomp = json.loads(DECOMP.read_text())
fbo = json.loads(FBO.read_text())
arch = json.loads(ARCH.read_text())

# Feature execution order: foundation in given order, then features, then integration.
features_meta = {}  # feature_id → {depends_on, parallel_group, name}
order = []
for f in fbo["foundation"]:
    features_meta[f["id"]] = {"depends_on": f["depends_on"], "parallel_group": 0, "name": f["name"]}
    order.append(f["id"])
for f in fbo["features"]:
    if f.get("deferred"): continue
    features_meta[f["id"]] = {"depends_on": f["depends_on"], "parallel_group": f.get("parallel_group", 0), "name": f["name"]}
    order.append(f["id"])
for f in fbo["integration_features"]:
    features_meta[f["id"]] = {"depends_on": f["depends_on"], "parallel_group": 0, "name": f["name"]}
    order.append(f["id"])

# Sanity: every ordered feature must have a decomposition
missing = [fid for fid in order if fid not in decomp]
extra = [fid for fid in decomp if fid not in order]
if missing or extra:
    print(f"MISSING decompositions: {missing}", file=sys.stderr)
    print(f"EXTRA decompositions: {extra}", file=sys.stderr)
    if missing: sys.exit(1)

# Assign global T-XXX IDs feature-by-feature in order.
tasks = []
local_to_global = {}  # (feature_id, local_id) → T-XXX
counter = 0
for fid in order:
    for t in decomp[fid]:
        counter += 1
        tid = f"T-{counter:03d}"
        local_to_global[(fid, t["local_id"])] = tid
        # Build the task in target shape; deps resolved in pass 2
        tasks.append({
            "id": tid,
            "title": t["title"],
            "description": t["description"],
            "acceptance_criteria": t["acceptance_criteria"],
            "depends_on": [],  # will be filled in pass 2
            "wave": None,
            "type": t.get("type", "implementation"),
            "files": t["files"],
            "skill_hint": t.get("skill_hint", "implement"),
            "architecture_context": t["architecture_context"],
            "source_feature_id": fid,
            "_local_id": t["local_id"],
            "_depends_on_local": t.get("depends_on_local", []),
            "status": "pending",
            "execution": {"summary_file": None, "completed_at": None},
        })

# Pass 2: resolve dependencies
# (a) intra-feature: depends_on_local → map via (fid, local_id)
# (b) cross-feature: if feature.depends_on contains F-YYY, then THIS feature's first task
#     depends on F-YYY's last task. We add that on the local_id=1 task of fid.
last_of_feature = {}  # fid → T-XXX of max local_id task
for fid in order:
    fid_tasks = [t for t in tasks if t["source_feature_id"] == fid]
    last_local = max(t["_local_id"] for t in fid_tasks)
    last_of_feature[fid] = next(t["id"] for t in fid_tasks if t["_local_id"] == last_local)

for t in tasks:
    fid = t["source_feature_id"]
    deps = set()
    # intra-feature
    for ll in t["_depends_on_local"]:
        deps.add(local_to_global[(fid, ll)])
    # cross-feature: EVERY task of F-XXX depends on the LAST task of each F-YYY in F-XXX.depends_on
    # (sibling tasks within F-XXX may have depends_on_local: [] meaning they can run in parallel
    # with each other, but they ALL still need the cross-feature prereqs)
    for upstream_fid in features_meta[fid]["depends_on"]:
        if upstream_fid in last_of_feature:
            deps.add(last_of_feature[upstream_fid])
    t["depends_on"] = sorted(deps)
    # strip private fields before write
    del t["_local_id"]
    del t["_depends_on_local"]

# Topological sort via Kahn's algorithm with wave numbers
by_id = {t["id"]: t for t in tasks}
in_deg = {t["id"]: len(t["depends_on"]) for t in tasks}
remaining_deps = {t["id"]: set(t["depends_on"]) for t in tasks}

wave = 0
processed = set()
while len(processed) < len(tasks):
    wave += 1
    ready = [tid for tid, deps in remaining_deps.items() if not deps and tid not in processed]
    if not ready:
        # cycle!
        unresolved = [tid for tid in remaining_deps if tid not in processed]
        print(f"CYCLE detected; unresolved tasks: {unresolved}", file=sys.stderr)
        for tid in unresolved:
            print(f"  {tid} depends on {sorted(remaining_deps[tid])}", file=sys.stderr)
        sys.exit(2)
    for tid in ready:
        by_id[tid]["wave"] = wave
        processed.add(tid)
    # remove ready from others' deps
    for tid in remaining_deps:
        remaining_deps[tid] -= set(ready)

# Generate integration stages for parallel waves
integration_stages = []
wave_counts = {}
for t in tasks:
    wave_counts.setdefault(t["wave"], 0)
    wave_counts[t["wave"]] += 1
for w in sorted(wave_counts):
    if wave_counts[w] >= 2:
        integration_stages.append({
            "wave": w,
            "id": f"INT-{w}",
            "description": f"Verify all wave-{w} tasks cohere: run pnpm exec biome ci, pnpm exec tsc --noEmit, pnpm vitest run, pnpm velite build, and any wave-relevant Playwright smoke specs. Check coherence across files touched in this wave.",
            "status": "pending",
        })

# Summary
parallel_waves = sum(1 for c in wave_counts.values() if c >= 2)
critical_path_length = max(wave_counts.keys())

# File-isolation check within each wave (warn only — not blocking)
file_conflicts = []
for w in sorted(wave_counts):
    wave_tasks = [t for t in tasks if t["wave"] == w]
    file_owners = {}
    for t in wave_tasks:
        for f in t["files"]:
            file_owners.setdefault(f, []).append(t["id"])
    for f, owners in file_owners.items():
        if len(owners) > 1:
            file_conflicts.append({"wave": w, "file": f, "tasks": owners})

if file_conflicts:
    print(f"FILE CONFLICTS within waves: {len(file_conflicts)}", file=sys.stderr)
    for c in file_conflicts:
        print(f"  wave {c['wave']}: {c['file']} edited by {c['tasks']}", file=sys.stderr)

# Build slug from product name
slug = "insafismath-com"
out = {
    "version": "1.0",
    "build_slug": slug,
    "product": {
        "name": arch["product"]["name"],
        "architecture_version": arch.get("version", "1.0"),
    },
    "source": {
        "mode": "full-pipeline",
        "srs_version": "1.0",
        "feature_build_order_version": "1.0",
        "feature_description": None,
    },
    "status": "draft",
    "tasks": tasks,
    "integration_stages": integration_stages,
    "summary": {
        "total_tasks": len(tasks),
        "wave_count": critical_path_length,
        "parallel_waves": parallel_waves,
        "integration_waves": parallel_waves,
        "critical_path_length": critical_path_length,
        "file_conflicts_within_waves": file_conflicts,
        "tasks_by_feature": {fid: sum(1 for t in tasks if t["source_feature_id"] == fid) for fid in order},
        "tasks_per_wave": {str(w): wave_counts[w] for w in sorted(wave_counts)},
    },
    "approved_by": None,
    "approved_date": None,
    "created_at": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
    "session_id": "02fbdc6a-cfce-43af-84f3-d6da361a251f",
}

OUT.write_text(json.dumps(out, indent=2))
print(f"WROTE {OUT}")
print(f"Tasks: {len(tasks)}; waves: {critical_path_length}; parallel waves: {parallel_waves}; file conflicts: {len(file_conflicts)}")
print(f"Tasks per wave: {dict(sorted(wave_counts.items()))}")
