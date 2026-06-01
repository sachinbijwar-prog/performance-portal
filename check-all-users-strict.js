const https = require('https');
https.get('https://firestore.googleapis.com/v1/projects/sa-review-app/databases/(default)/documents/appraisals/company_wide', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const doc = JSON.parse(data);
        const emps = doc.fields.employees.mapValue.fields;
        let count = 0;
        console.log("Users with actual data (score > 0 or comment written):");
        for (const id in emps) {
            const emp = emps[id].mapValue.fields;
            const status = emp.statusOverride ? emp.statusOverride.stringValue : '';
            
            let hasActualData = false;
            if (emp.kras && emp.kras.arrayValue.values) {
                const kras = emp.kras.arrayValue.values;
                for(const kra of kras) {
                    const fields = kra.mapValue.fields;
                    if(fields.self) {
                        const self = fields.self.mapValue.fields;
                        const rating = self.rating ? (self.rating.integerValue || self.rating.stringValue) : 0;
                        const comment = self.comment ? self.comment.stringValue : '';
                        if (parseInt(rating) > 0 || (comment && comment.trim() !== '')) {
                            hasActualData = true;
                        }
                    }
                }
            }
            
            if (hasActualData || status.includes("Completed") || status.includes("Done") || status.includes("Approved") || status.includes("Finalized")) {
                console.log(`- ${id} (Status: ${status || 'Draft, but has saved ratings/comments'})`);
                count++;
            }
        }
        console.log(`\nTotal users with actual data: ${count}`);
    });
});
