const userModel = (sequelize, Sequelize) => {

    const user = sequelize.define('user', {
        id:{
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userName:{
            type: Sequelize.STRING,
        },
        userEmail:{
            type: Sequelize.STRING,
        },
        userPassword:{
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
    },
    )
    return user;
}

export default userModel;