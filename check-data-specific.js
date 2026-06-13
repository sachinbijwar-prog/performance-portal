const https = require('https');
https.get('https://firestore.googleapis.com/v1/projects/sa-review-app/databases/(default)/documents/appraisals/company_wide', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const doc = JSON.parse(data);
        const emps = doc.fields.employees.mapValue.fields;
        for (const id of ['sachin.bijwar', 'abdul']) {
            if (emps[id]) {
                const emp = emps[id].mapValue.fields;
                console.log(`\nUser: ${id}`);
                console.log('Status Override:', emp.statusOverride ? emp.statusOverride.stringValue : 'Not overridden');
                if (emp.kras && emp.kras.arrayValue.values) {
                    const kras = emp.kras.arrayValue.values;
                    let hasData = false;
                    for(const kra of kras) {
                        const fields = kra.mapValue.fields;
                        if(fields.self && fields.self.mapValue.fields.rating) {
                            hasData = true;
                        }
                    }
                    console.log('Has KRA Data?', hasData ? 'YES' : 'NO');
                } else {
                    console.log('Has KRA Data? NO');
                }
            } else {
                console.log(`\nUser: ${id} not found in database!`);
            }
        }
    });
});
