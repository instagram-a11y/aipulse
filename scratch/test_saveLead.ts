import 'dotenv/config'
import { saveLeadAndNotify } from '../lib/saveLead'

async function run() {
  const result = await saveLeadAndNotify({
    name: 'Local Test 2',
    email: 'local2@example.com',
    phone: '555-5555',
    projectDetails: 'local details 2',
    requiredDataFromClient: ['req 1'],
    deliverables: ['del 1'],
    executionSteps: ['step 1'],
    language: 'en'
  })
  console.log('Result:', result)
}
run()
