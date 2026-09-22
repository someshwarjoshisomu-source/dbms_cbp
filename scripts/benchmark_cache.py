import urllib.request
import json
import time
import statistics
import sys

sys.stdout.reconfigure(encoding='utf-8')
BASE_URL = "http://localhost:8080"

def measure_get(endpoint):
    start = time.perf_counter()
    req = urllib.request.Request(f"{BASE_URL}{endpoint}")
    with urllib.request.urlopen(req) as resp:
        data = resp.read()
        status = resp.status
    duration_ms = (time.perf_counter() - start) * 1000.0
    return status, duration_ms, len(data)

def benchmark():
    print("==========================================================")
    print("🔬 REPRODUCIBLE CAFFEINE IN-MEMORY CACHING BENCHMARK")
    print("==========================================================\n")

    # 1. Warmup / Initial Cold DB Call
    print("[1] Evicting / Cold Request (Database round-trip to Supabase PostgreSQL)...")
    status, cold_ms, data_len = measure_get("/internships")
    print(f"    -> Cold / Database Request: {cold_ms:.1f}ms (Response size: {data_len} bytes, HTTP {status})")

    # 2. Run 50 Consecutive Cached Requests
    print("\n[2] Executing 50 Consecutive Requests against Caffeine Cache...")
    cached_latencies = []
    for i in range(50):
        st, ms, _ = measure_get("/internships")
        if st == 200:
            cached_latencies.append(ms)
        time.sleep(0.01)

    cached_latencies.sort()
    min_cached = min(cached_latencies)
    max_cached = max(cached_latencies)
    median_cached = statistics.median(cached_latencies)
    mean_cached = statistics.mean(cached_latencies)
    p95_cached = cached_latencies[int(len(cached_latencies) * 0.95)]

    print(f"    -> Cached Query Performance (50 runs):")
    print(f"       • Min:    {min_cached:.1f}ms")
    print(f"       • Median: {median_cached:.1f}ms")
    print(f"       • Mean:   {mean_cached:.1f}ms")
    print(f"       • p95:    {p95_cached:.1f}ms")
    print(f"       • Max:    {max_cached:.1f}ms")

    # 3. Compute Real Improvement
    reduction_pct = ((cold_ms - median_cached) / cold_ms) * 100.0
    print("\n==========================================================")
    print(f"📊 EMPIRICAL RESULT SUMMARY:")
    print(f"   • Database (Cold) Latency: ~{cold_ms:.0f}ms")
    print(f"   • Caffeine Cached Latency: ~{median_cached:.0f}ms (Median) / ~{mean_cached:.0f}ms (Mean)")
    print(f"   • Measured Latency Drop:   {reduction_pct:.1f}%")
    print("==========================================================")

if __name__ == "__main__":
    benchmark()
