const bcrypt = require("bcrypt");

const db = require("../models/index.js");
const user = db.user;
const user_address = db.user_address;
const user_family = db.user_family;

const delete_image = require("../middlewares/delete_image_file.js");
const display = require("../controllers/result_display.js");

exports.register = async (req, res) => {
  try {
    //const user_data = JSON.parse(req.body.data);
    const user_data = req.body;
    const hashed_password = await bcrypt.hash(user_data.password, 10);
    user_data.password = hashed_password;
    user_data.role = 0;
    user_data.is_active = 1;

    user_data.image = req.file.path;

    const check_data = await user.findOne({
      where: {
        email_id: user_data.email_id,
      },
    });

    if (check_data) {
      await delete_image.delete(user_data.image, res);

      display.end_result(res, 200, { message: "Already registerd email_id" });
      return;
    }

    const data = await user.create(user_data, {
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    const response_data = { ...data.get({ plain: true }) };
    const { password, role, ...new_data } = response_data;
    if (new_data) {
      //new_data.image = new_data.image.toString('base64')
      new_data.image = new_data.image.toString();
      display.end_result(res, 200, new_data);
    } else {
      display.end_result(res, 400, { message: "registeration failed" });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while creating the user.",
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const req_data = req.data;

    let id = parseInt(req_data.user_id);

    const data = await user.findOne({
      attributes: { exclude: ["password", "role"] },
      where: {
        user_id: id,
      },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    if (data) {
      data.image = data.image.toString();
      //data.image =data.image.toString('base64')

      display.end_result(res, 200, data);
      return;
    } else {
      display.end_result(res, 400, { message: "user is not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const data = await user.findAll({
      attributes: { exclude: ["password", "role"] },
      where: {
        role: 0,
      },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    for (val of data) {
      val.image = val.image.toString();
      //val.image =val.image.toString('base64')
    }

    display.end_result(res, 200, data);
    return;
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving users.",
    });
    return;
  }
};

exports.findID = async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    const data = await user.findOne({
      attributes: { exclude: ["password", "role"] },
      where: {
        user_id: id,
        role: 0,
      },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    if (data) {
      data.image = data.image.toString();
      //data.image =data.image.toString('base64')

      display.end_result(res, 200, data);
      return;
    } else {
      display.end_result(res, 400, { message: "user is not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while retrieving users.",
    });
  }
};

exports.updateByID = async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    const user_data = req.body;

    const data = await user.findByPk(id, {
      attributes: { exclude: ["password", "role"] },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    if (data) {
      //      await data.update(user_data);

      const { address, family_details, ...only_user_data } = user_data;

      await data.update(only_user_data);
      if (Object.keys(user_data.address).length) {
        await data.address.update(address);
      }

      if (Object.keys(user_data.family_details).length) {
        await data.family_details.update(family_details);
      }

      await data.save();
      data.image = data.image.toString();
      display.end_result(res, 200, {
        message: "Updated sucessfully",
        updated_user: data,
      });
    } else {
      display.end_result(res, 400, { message: "user is not found" });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while updating the user.",
    });
  }
};

exports.deleteByID = async (req, res) => {
  try {
    let id = parseInt(req.params.id);

    result = await user.findByPk(id, {
      where: {
        role: 0,
      },
    });

    if (result) {
      await delete_image.delete(result.image, res);

      const data = await user.destroy({
        where: {
          user_id: id,
        },
      });

      if (data > 0) {
        display.end_result(res, 200, { message: "deleted successfully" });
        return;
      }
    } else {
      display.end_result(res, 400, { message: "user is not found" });
      return;
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while deleting the user.",
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    const user_data = req.body;

    const data = await user.findByPk(id, {
      attributes: { exclude: ["password", "role"] },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    if (data) {
      // if(data.role == 1 && req_data.role == 1 && req_data.user_id != data.user_id){
      //   display.end_result(res,403,{"message": "sorry you don't have the access to update other's details"});
      //   return;
      // }

      await data.update(user_data);
      await data.save();

      data.image = data.image.toString();

      //      res.setHeader('Authorization', `Bearer ${token}`);
      display.end_result(res, 200, {
        message: "Updated sucessfully",
        updated_user: data,
      });
    } else {
      display.end_result(res, 400, { message: "user is not found" });
    }
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while updating the user.",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    //const req_data = req.data;

    let id = parseInt(req.data.user_id);
    const user_data = req.body;

    const data = await user.findByPk(id, {
      attributes: { exclude: ["password", "role"] },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    //      await data.update(user_data);

    const { address, family_details, ...only_user_data } = user_data;

    await data.update(only_user_data);
    if (Object.keys(user_data.address).length) {
      await data.address.update(address);
    }

    if (Object.keys(user_data.family_details).length) {
      await data.family_details.update(family_details);
    }

    await data.save();
    data.image = data.image.toString();
    display.end_result(res, 200, {
      message: "Updated sucessfully",
      updated_user: data,
    });
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while updating the user.",
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    let id = parseInt(req.data.user_id);

    const user_data = {
      image: req.file.path,
    };

    const data = await user.findByPk(id, {
      attributes: { exclude: ["password", "role"] },
      include: [
        {
          model: user_address,
          as: "address",
          required: true,
        },
        {
          model: user_family,
          as: "family_details",
          required: true,
        },
      ],
    });

    await delete_image.delete(data.image, res);

    await data.update(user_data);
    await data.save();

    data.image = data.image.toString();
    display.end_result(res, 200, {
      message: "Updated sucessfully",
      updated_user: data,
    });
  } catch (err) {
    display.end_result(res, err.status || 500, {
      message: err.message || "Some error occurred while updating the user.",
    });
  }
};
