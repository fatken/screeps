var roleHealer = {
	/**@param {Creep} creep **/
	run:function(creep) {
		if(creep.memory.followingCreep){
			//console.log(creep.memory.followingCreep);
			creep.heal(Game.getObjectById(creep.memory.followingCreep));
			creep.moveTo(Game.getObjectById(creep.memory.followingCreep));
		}

		else {
			if(creep.room.name == creep.memory.home){
				var damagedCreep = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
					filter: (creep) => {
						return (creep.memory.role == 'guard') && creep.hits < creep.hitsMax - 100;
					}
				});

				if(damagedCreep){
					if(creep.moveTo(damagedCreep) == ERR_NOT_IN_RANGE){
						creep.moveTo(damagedCreep);
					}
				}
			}
		}
	}
};

module.exports = roleHealer;