var roleRepairer = require('role.repairer');

var roleBuilder = {
	/**@param {Creep} creep **/
	run:function(creep) {
		if(creep.room.name == creep.memory.target){
			if(creep.carry.energy == 0 && creep.memory.working == true){
				creep.memory.working = false;
				//creep.say('harvesting');
			}
			if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
				creep.memory.working = true;
				//creep.say('working');
			}

			//script for finding all the construction sites in range
			/*
			if(creep.memory.building){
				var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(targets.length){
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE){
						creep.moveTo(targets[0]);
					}
				}
			}
			*/ 

			//script for finding closest and build
			if(creep.memory.working){
				if(creep.memory.target && creep.room.name != creep.memory.target){
					var exit = creep.room.findExitTo(creep.memory.target);
					creep.moveTo(creep.pos.findClosestByRange(exit));
				}
				else{
					var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES );/*, {
							filter: (structure) => structure.structureType !== STRUCTURE_WALL
					}*/
					
					if(target){
						if(creep.build(target) == ERR_NOT_IN_RANGE){
							creep.moveTo(target);
						}
					}
					
					else {
						roleRepairer.run(creep);
					}
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
						let energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
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
		else{
			var exit = creep.room.findExitTo(creep.memory.target);
			//creep move to the home room through exit
			creep.moveTo(creep.pos.findClosestByRange(exit));
		}
	}
};

module.exports = roleBuilder;