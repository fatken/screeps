//var roleBuilder = require('role.builder');

var roleUpgrader = {
	run: function(creep){
		if(creep.carry.energy == 0 && creep.memory.working == true){
			creep.memory.working = false;
			//creep.say('harvesting');
		}
		if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
			creep.memory.working = true;
			//creep.say('upgrading');
		}
		
		if(creep.memory.working){
			//roleBuilder.run(creep);
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
				creep.moveTo(creep.room.controller);
			}
		}
		else {
			let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: s => {
					return (s.structureType == STRUCTURE_CONTAINER || 
							 s.structureType == STRUCTURE_STORAGE)
				&& s.store[RESOURCE_ENERGY] > creep.carryCapacity
				}
			});
			if (container){
				if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
					creep.moveTo(container);
				}
			}
			else {
				let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
				if (source){
					if (creep.harvest(source) == ERR_NOT_IN_RANGE){
						creep.moveTo(source);
					}
				}
				else {
					var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
					if (energy){
						if (creep.pickup(energy) == ERR_NOT_IN_RANGE){
							creep.moveTo(energy);
						}
					}
					else {
						creep.memory.working = true;
					}
				}
			}
		}
	}
};

module.exports = roleUpgrader;