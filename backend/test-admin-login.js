const testAdminLogin = async () => {
    try {
        console.log('🔐 Testing Admin Login API...\n');
        
        const response = await fetch('http://localhost:5000/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const data = await response.json();
        
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('\n✅ Login Successful!');
            console.log('Token:', data.data.token.substring(0, 20) + '...');
            console.log('Admin:', data.data.admin.username);
            console.log('Role:', data.data.admin.role);
        } else {
            console.log('\n❌ Login Failed!');
            console.log('Message:', data.message);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testAdminLogin();
