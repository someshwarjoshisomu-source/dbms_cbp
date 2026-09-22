import time
import requests
import concurrent.futures
import numpy as np
import sys

# Configure UTF-8 stdout encoding for Windows console
sys.stdout.reconfigure(encoding='utf-8')

# --- CONFIGURATION ---
TARGET_URL = "http://localhost:8080/internships"
TOTAL_REQUESTS = 2000
CONCURRENT_USERS = 200 # Pushing standard Tomcat platform thread pool past default 200 limits

import threading

thread_local = threading.local()

def get_session():
    if not hasattr(thread_local, "session"):
        s = requests.Session()
        adapter = requests.adapters.HTTPAdapter(pool_connections=25, pool_maxsize=25)
        s.mount("http://", adapter)
        thread_local.session = s
    return thread_local.session

def fetch_url(url):
    s = get_session()
    start_time = time.time()
    try:
        response = s.get(url, timeout=10)
        latency = (time.time() - start_time) * 1000 # in milliseconds
        return latency, response.status_code
    except requests.exceptions.RequestException:
        return None, 500

def run_load_test():
    print("=========================================================")
    print("🚀 HIGH-CONCURRENCY LOAD TEST (Java 21 Virtual Threads)")
    print("=========================================================")
    print(f"Target URL:        {TARGET_URL}")
    print(f"Concurrent Users:  {CONCURRENT_USERS}")
    print(f"Total Requests:    {TOTAL_REQUESTS}")
    print("Executing benchmark...\n")
    
    latencies = []
    errors = 0
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENT_USERS) as executor:
        futures = [executor.submit(fetch_url, TARGET_URL) for _ in range(TOTAL_REQUESTS)]
        
        for future in concurrent.futures.as_completed(futures):
            latency, status = future.result()
            if latency is not None and status == 200:
                latencies.append(latency)
            else:
                errors += 1

    total_time = time.time() - start_time
    
    if not latencies:
        print("❌ All requests failed! Is the backend running on http://localhost:8080?")
        return

    # --- METRICS CALCULATION ---
    rps = TOTAL_REQUESTS / total_time
    p50 = np.percentile(latencies, 50)
    p95 = np.percentile(latencies, 95)
    p99 = np.percentile(latencies, 99)
    min_lat = min(latencies)
    max_lat = max(latencies)
    
    print("=========================================================")
    print("📊 EMPIRICAL CONCURRENCY RESULTS")
    print("=========================================================")
    print(f"Total Elapsed Time: {total_time:.2f} seconds")
    print(f"Peak Throughput:    {rps:.2f} Requests/Sec (RPS) [{rps * 60:.0f} req/min]")
    print(f"Error Rate:         {(errors/TOTAL_REQUESTS)*100:.2f}% ({errors} errors)")
    print("\n--- LATENCY PERCENTILE DISTRIBUTION ---")
    print(f"Min Latency:        {min_lat:.2f} ms")
    print(f"p50 (Median):       {p50:.2f} ms")
    print(f"p95:                {p95:.2f} ms")
    print(f"p99:                {p99:.2f} ms")
    print(f"Max Latency:        {max_lat:.2f} ms")
    print("=========================================================")

if __name__ == "__main__":
    run_load_test()
