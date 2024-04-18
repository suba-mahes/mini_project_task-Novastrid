const fs = require('fs');

exports.delete = (data) =>{
    
    if (fs.existsSync(data)) {
        fs.unlink(data, (err) => {
          if (err) {
            display.end_result(res,err.status  || 500,{"message": err.message || "Some error occurred while deleting the user."});
            return;
          } 
        });
    }

}
