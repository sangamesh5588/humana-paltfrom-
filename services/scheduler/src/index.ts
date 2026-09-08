export async function runSchedulerService() {
  console.log('Scheduler Service Initialized');
}

if (require.main === module) {
  runSchedulerService();
}
