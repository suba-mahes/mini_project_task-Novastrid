"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const db = require("../models/index");
const user_model = db.user;

const config = require("../config/config.json");

const file_path = "C:/Users/MY PC/Desktop/inba/user_project/user1.jpg";
const file_name = path.basename(file_path);

const destination_path = path.join(
  config.image_upload_directory,
  Date.now() + "-" + file_name
);

const image_data = fs.readFileSync(file_path);
fs.writeFileSync(destination_path, image_data);

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await user_model.bulkCreate(
      [
        {
          is_active: 1,
          role: 0,
          email_id: "aaa@gmail.com",
          password: await bcrypt.hash("Password@123", 10),
          first_name: "aaa",
          last_name: "bbb",
          gender: "female",
          image: destination_path,
          d_o_b: new Date("2001-01-01"),
        },
      ],
      { returning: true }
    );

    const userIds = users.map((user) => user.user_id);

    await queryInterface.bulkInsert("user_addresses", [
      {
        address1: "9A muthu street",
        address2: "mathichiyam",
        city: "madu",
        state: "TN",
        country: "Ind",
        user_id: userIds[0],
      },
    ]);

    await queryInterface.bulkInsert("user_families", [
      {
        gardian_name: "inba",
        mother_name: "kane",
        gardian_occupation: "off",
        mother_occupation: "hw",
        no_of_sibilings: 1,
        user_id: userIds[0],
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("user_addresses", null, {});
    await queryInterface.bulkDelete("user_families", null, {});
  },
};
