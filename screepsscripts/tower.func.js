var structureThreshold = 0.5;
var wallThreshold = 0.001;
var defenseStructureHits = 3000000;
var towerFunc = {
	/**@param {Creep} creep **/
	run:function(tower) {
		if(tower){
			//auto attack
			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(closestHostile){
				tower.attack(closestHostile);
			}
			
			else {
				for (var name in Game.creeps){
					var creep = Game.creeps[name];
					if(creep.hits < creep.hitsMax){
							tower.heal(creep);
						}
				}
				if(tower.energy > tower.energyCapacity / 2){			
					//auto repair
					var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {   //structure road doesnt belong to you so no find my structures
						filter: (structure) => 
							(structure.structureType != STRUCTURE_WALL &&
							 structure.structureType != STRUCTURE_RAMPART)
							&& structure.hits < structure.hitsMax * structureThreshold
					});
					if(closestDamagedStructure){
						tower.repair(closestDamagedStructure);
					}
					else{
						var closestDamagedDefense = tower.pos.findClosestByRange(FIND_STRUCTURES, {	//walls, even if built by you, doesn't belong to you so cannot use FIND_MY_STRUCTURES
							filter: (structure) => 
								(structure.structureType == STRUCTURE_WALL ||
								 structure.structureType == STRUCTURE_RAMPART) && structure.hits < defenseStructureHits //structure.hitsMax * wallThreshold
						});	
						if(closestDamagedDefense){
							tower.repair(closestDamagedDefense);
						}
					}
					//console.log(closestDamagedStructure);
					

					//auto heal creeps

				}
			}
		}
	}
};

module.exports = towerFunc;