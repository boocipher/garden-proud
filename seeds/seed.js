const sequelize = require('../config/connection');
const { User, Plant, Garden } = require('../models');

const userData = require('./userData.json');
const plantData = require('./plantData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  console.log("User 2 id and email: " + users[1].id + " " + users[1].email);

  const plants = await Plant.bulkCreate(plantData, {
    individualHooks: true,
    returning: true,
  });

  for (let i=0; i<10; i++) {
    const userId = Math.floor(Math.random() * users.length);
    const gardenId = Math.floor(Math.random() * plants.length);
    console.log(`Will create garden with userId:${userId}, gardenId:${gardenId}`);

    await Garden.create({
      user_id: users[userId].id,
      plant_id: plants[gardenId].id
    }, {
      fields: ["user_id", "plant_id"]
    })
    .catch (err => {
      console.log(err);
    });
  }

  process.exit(0);
};

seedDatabase();