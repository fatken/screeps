var roleUpgrader = require('role.upgrader');

var roleLongDistanceHarvester = {
	/**@param {Creep} creep **/
	run:function(creep){
		if(creep.carry.energy == 0 && creep.memory.working == true){
			creep.memory.working = false;
		}
		else if(creep.carry.energy == creep.carryCapacity && creep.memory.working == false){
			creep.memory.working = true;
		}

		if(creep.memory.working){
			if(creep.room.name == creep.memory.home){
				//harvester auto repair along the path
				/*
				var repairTargets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
					filter: function(object) {
						return object.hits < object.hitsMax
							&& object.hitsMax - object.hits > REPAIR_POWER;
					}
				});
				repairTargets.sort(function (a,b) {return (a.hits - b.hits)});
				if (repairTargets.length > 0)
					creep.repair(repairTargets[0]);
				*/

				var primary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION || 
								structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
					}
				});

				var secondary = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_TOWER ||
								structure.structureType == STRUCTURE_CONTAINER||
								structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity; //&& structure.energy < structure.energyCapacity /2;
					}
				});

				if(primary){
					if(creep.transfer(primary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
						creep.moveTo(primary);
						//creep.say('transfering');
					}
				}
				else if(secondary){
					if(creep.transfer(secondary, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
						creep.moveTo(secondary);
						//creep.say('transfering');
					}
				}
				else{
					roleUpgrader.run(creep);
				}

			}
			else {
				//proper way of going to another room
				//find the exit to the home room
				var exit = creep.room.findExitTo(creep.memory.home);
				//creep move to the home room through exit
				creep.moveTo(creep.pos.findClosestByRange(exit));

				//only works if you have a vision
				//creep.moveTo(Game.rooms[creep.memory.home].); 
			}
		}
		else{
			if(creep.room.name == creep.memory.target){
				var sources = creep.room.find(FIND_SOURCES);

/*
				if(sources[creep.memory.src].energy == 0){
					creep.memory.working = true;
				}
*/
				if(creep.harvest(sources[creep.memory.src]) == ERR_NOT_IN_RANGE){
					creep.moveTo(sources[creep.memory.src]);
					//creep.say('harvesting');
				}
			}
			else{
				var exit = creep.room.findExitTo(creep.memory.target);
				//creep move to the home room through exit
				creep.moveTo(creep.pos.findClosestByRange(exit));
			}
		}
	}
};

module.exports = roleLongDistanceHarvester;