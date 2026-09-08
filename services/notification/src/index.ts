export async function runNotificationService() {
  console.log('Notification Service Initialized');
}

if (require.main === module) {
  runNotificationService();
}
