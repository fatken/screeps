var wallThreshold = 0.0002;

var roleWallRepairer = {
	run: function (creep) {
		if (creep.carry.energy == 0 && creep.memory.working == true) {
			creep.memory.working = false;
			//creep.say('harvesting');
		}
		if (creep.carry.energy == creep.carryCapacity && creep.memory.working == false) {
			creep.memory.working = true;
			//creep.say('repairing');
		}

		//script for finding closest and build
		if (creep.memory.working) {
			var walls = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax * structureThreshold
			});

			var targetWall;

			if (walls) {
				for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
				/*	
					targetWall = creep.pos.findClosestByPath(walls, {
							filter: (w) => w.hits / w.hitsMax < percentage
				});
				*/
					for(let wall of walls){
						if(wall.hits / wall.hitsMax < percentage){
							targetWall = wall;
							break;
						}
					}
					if (targetWall) {
						break;
					}
				}
				if (targetWall) {
					if (creep.repair(targetWall) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targetWall);
					}
				}
				else {
					roleBuilder.run(creep);
				}
			}
		}
		else {
			var sources = creep.room.find(FIND_SOURCES);
			if (creep.harvest(sources[creep.memory.src]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[creep.memory.src]);
			}
		}
	}
};

module.exports = roleWallRepairer;