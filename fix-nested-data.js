const https = require('https');
// We will use the REST API to fetch the whole document, manually manipulate it, and PUT it back.
// The easiest way is to fetch it, extract the nested data, put it in the flat fields, and then write it.
https.get('https://firestore.googleapis.com/v1/projects/sa-review-app/databases/(default)/documents/appraisals/company_wide', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const doc = JSON.parse(data);
        const emps = doc.fields.employees.mapValue.fields;
        
        const idsToFix = [
            { parent: 'arjun', child: 'tiwari', flat: 'arjun.tiwari' },
            { parent: 'srirum', child: 'sridhar', flat: 'srirum.sridhar' },
            { parent: 'sachin', child: 'bijwar', flat: 'sachin.bijwar' },
            { parent: 'abdul', child: 'mannan', flat: 'abdul.mannan' }
        ];

        let fixed = false;
        for (const {parent, child, flat} of idsToFix) {
            if (emps[parent] && emps[parent].mapValue.fields[child]) {
                const nestedData = emps[parent].mapValue.fields[child];
                emps[flat] = nestedData; // Copy to flat key
                delete emps[parent].mapValue.fields[child]; // Remove from nested
                
                // If parent is now empty, delete parent
                if (Object.keys(emps[parent].mapValue.fields).length === 0) {
                    delete emps[parent];
                }
                fixed = true;
                console.log(`Migrated ${flat} from nested dot notation to flat string!`);
            }
        }

        if (fixed) {
            const req = https.request('https://firestore.googleapis.com/v1/projects/sa-review-app/databases/(default)/documents/appraisals/company_wide', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            }, (res2) => {
                let d2 = '';
                res2.on('data', c => d2 += c);
                res2.on('end', () => {
                    console.log("Successfully updated database:", res2.statusCode);
                });
            });
            req.write(JSON.stringify(doc));
            req.end();
        } else {
            console.log("Nothing to fix. Already flat.");
        }
    });
});
