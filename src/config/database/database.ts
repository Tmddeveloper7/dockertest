import { Sequelize,DataTypes } from "sequelize";

let database = process.env.database;
let user = process.env.user;

const sequelize = new Sequelize(
  `${database}`,
  `${user}`,
  process.env.password ? process.env.password : "",
  {
    dialect: "mysql",
    host: process.env.host,
    logging: false,
    timezone: "+05:30", 
    define: {
      timestamps: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
      // deletedAt:"deleted_at"
      createdAt: false,
      updatedAt: false,
      deletedAt:false
    },
  }
);


sequelize.addHook('beforeDefine', (attributes) => {

  attributes.created_by = {
    type: DataTypes.INTEGER,
    allowNull: true,
  };
  // attributes.updated_by = {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  // };
  attributes.deleted_by = {
    type: DataTypes.INTEGER,
    allowNull: true,
  };
  attributes.deleted_at = {
    type: DataTypes.DATE,
    allowNull: true,
  };
  attributes.created_at = {
    type: DataTypes.DATE,
    defaultValue:new Date(),
    allowNull:false
  };
  // attributes.updated_at = {
  //   type: DataTypes.DATE,
  //   defaultValue:new Date(),
  //   allowNull:false
  // };

});
// sequelize.addHook('beforeCreate', (instance) => {
//   instance.setDataValue("created_at" , new Date());
// });
// sequelize.addHook("beforeUpdate", (instance) => {
//   instance.setDataValue("updated_at", new Date());
// });


// sequelize.query(`CREATE DATABASE ${database};`).then(data => {
//     console.log('database created')
// }).catch(e=>{
//     console.error('error in creating db',e);
// });

// const umzug = new Umzug({
//     migrations: {
//         // indicates the folder containing the migration .js files
//         path: path.join(__dirname, './migrations'),
//         // inject sequelize's QueryInterface in the migrations
//         params: [
//             sequelize.getQueryInterface()
//         ]
//     },
//     // indicates that the migration data should be store in the database
//     // itself through sequelize. The default configuration creates a table
//     // named `SequelizeMeta`.
//     storage: 'sequelize',
//     storageOptions: {
//         sequelize: sequelize
//     }
// });

// (async () => {
//     // checks migrations and run them if they are not already applied
//     await umzug.up()
//     console.log('All migrations performed successfully')
// })()

export { sequelize };
