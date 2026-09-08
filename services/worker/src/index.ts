export async function runWorkerService() {
  console.log('Queue Worker Service Initialized');
}

if (require.main === module) {
  runWorkerService();
}
