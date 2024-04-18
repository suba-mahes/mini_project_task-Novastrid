const fs = require('fs');
const display = require("../controllers/result_display");

exports.delete =  async(filePath, res) => {
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
              display.end_result(res, err.status || 500, { "message": err.message || "Some error occurred." });
              return;
            }
        });
    }
};
