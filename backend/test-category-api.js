import axios from 'axios';

async function testCategoryAPI() {
    try {
        console.log('\n🧪 ===== TESTING CATEGORY API =====\n');
        
        const response = await axios.get('http://localhost:5000/api/categories');
        
        console.log('✅ API Response Status:', response.status);
        console.log('✅ Success:', response.data.success);
        console.log(`📊 Total Categories: ${response.data.data.categories.length}\n`);
        
        console.log('Categories with Images:\n');
        response.data.data.categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.name}`);
            console.log(`   Image: ${cat.image || 'NOT SET'}`);
            console.log(`   Icon: ${cat.icon || 'NOT SET'}`);
            console.log('');
        });
        
        console.log('===== TEST COMPLETE =====\n');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testCategoryAPI();
