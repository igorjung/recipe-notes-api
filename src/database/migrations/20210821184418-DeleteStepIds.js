module.exports = {
  up: async queryInterface => {
    return [
      await queryInterface.removeColumn('ingredients', 'step_id'),
      await queryInterface.removeColumn('utensils', 'step_id'),
    ];
  },

  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('ingredients', 'step_id', {
        type: Sequelize.INTEGER,
        references: { model: 'steps', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }),
      await queryInterface.addColumn('utensils', 'step_id', {
        type: Sequelize.INTEGER,
        references: { model: 'steps', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }),
    ];
  },
};
