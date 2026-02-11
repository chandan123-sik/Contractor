import { MongoClient } from 'mongodb';

const checkDatabase = async () => {
    const client = new MongoClient('mongodb://localhost:27017/rajghar');
    
    try {
        await client.connect();
        console.log('\n========================================');
        console.log('VERIFICATION REQUESTS IN DATABASE');
        console.log('========================================\n');
        
        const db = client.db('rajghar');
        const requests = await db.collection('verificationrequests')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        
        console.log('Total Requests:', requests.length);
        
        // Breakdown by type
        const byType = {};
        requests.forEach(r => {
            byType[r.entityType] = (byType[r.entityType] || 0) + 1;
        });
        
        console.log('\nBreakdown by Entity Type:');
        Object.entries(byType).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });
        
        console.log('\nAll Requests:');
        console.log('============================================');
        requests.forEach(r => {
            console.log(`\nRequest ID: ${r.requestId}`);
            console.log(`  Type: ${r.entityType}`);
            console.log(`  Name: ${r.name}`);
            console.log(`  Phone: ${r.phone}`);
            console.log(`  Aadhaar: ${r.aadhaarNumber}`);
            console.log(`  Status: ${r.status}`);
            console.log(`  Created: ${r.createdAt}`);
        });
        console.log('\n============================================\n');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.close();
    }
};

checkDatabase();
