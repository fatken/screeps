
var roleAttacker = {
	/**@param {Creep} creep **/
	run:function(creep){
		if(creep.memory.attacking){
			if(creep.room.name == creep.memory.target){
				/*
				var closestWall = creep.pos.findInRange(FIND_STRUCTURES, 1,{
					filter: (structure) => 
						structure.structureType == STRUCTURE_WALL  && structure.hits
				});
				if(closestWall){
					console.log('wall' + closestWall);
					console.log(creep.attack(closestWall));
					if(creep.attack(closestWall) == ERR_NOT_IN_RANGE){
						creep.moveTo(closestWall);
					}
				}*/
				//else{
					let hostileTower = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
						filter: (s) => {
							return s.structureType == STRUCTURE_TOWER;
						}
					});
					//console.log(hostileTower);
				if(hostileTower){
					//console.log(creep.attack(hostileTower));
					if(creep.attack(hostileTower) == ERR_NOT_IN_RANGE){
						//console.log(creep.moveTo(hostileTower));
						if(creep.moveTo(hostileTower) == -2){
							if(creep.memory.closestWall){
								if(creep.attack(Game.getObjectById(creep.memory.closestWall)) == ERR_NOT_IN_RANGE){
									creep.moveTo(Game.getObjectById(creep.memory.closestWall));
								}
							}
							else{
								creep.memory.closestWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		                        	filter: (structure) => (structure.structureType == STRUCTURE_WALL ||structure.structureType == STRUCTURE_RAMPART)
		                    }).id;
							}
		                }
					}
				}

				else{					
					let enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
					if(enemy){
						//console.log('enemy' + enemy);
						//console.log(creep.attack(enemy));
						if(creep.attack(enemy) == ERR_NOT_IN_RANGE){
							creep.moveTo(enemy);
						}
						else if(creep.attack(enemy) == -2){
		                    let closestWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		                        filter: (structure) => (structure.structureType == STRUCTURE_WALL)
		                    });
		                    if(closestWall){
		                        if(creep.attack(closestWall) == ERR_NOT_IN_RANGE){
		                            creep.moveTo(closestWall);
		                        }
		                    }
		                }
					}

					else{
						let hostileSpawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
						if(hostileSpawn){
							if(creep.attack(hostileSpawn) == ERR_NOT_IN_RANGE){
								creep.moveTo(hostileSpawn);
							}
							else if(creep.attack(hostileSpawn) == -2){
			                    let closestWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			                        filter: (structure) => (structure.structureType == STRUCTURE_WALL)
			                    });
			                    if(closestWall){
			                        if(creep.attack(closestWall) == ERR_NOT_IN_RANGE){
			                            creep.moveTo(closestWall);
			                        }
			                    }
			                }
			            }

						else{
							let hostileStructure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
		                        filter: (structure) => (structure.structureType != STRUCTURE_CONTROLLER)
		                    });

							//console.log(hostileStructure);
							if(hostileStructure){
								//console.log(creep.attack(hostileStructure));
								if(creep.attack(hostileStructure) == ERR_NOT_IN_RANGE){

									creep.moveTo(hostileStructure);
								}
								else if(creep.attack(hostileStructure) == -2){
				                    let closestWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				                        filter: (structure) => (structure.structureType == STRUCTURE_WALL)
				                    });
				                    if(closestWall){
				                        if(creep.attack(closestWall) == ERR_NOT_IN_RANGE){
				                            creep.moveTo(closestWall);
				                        }
				                    }
				                }
							}
							else{

								creep.moveTo(creep.room.controller);
							}	
						}
					}
				}		
			}
			else {
				var exit = creep.room.findExitTo(creep.memory.target);
				creep.moveTo(creep.pos.findClosestByRange(exit));
			}
		}
		else{
			if (creep.memory.home == creep.room.name) {			
				creep.moveTo(creep.room.controller);
			}
			else{
				var home = creep.room.findExitTo(creep.memory.home);
				creep.moveTo(creep.pos.findClosestByRange(home));
			}
		}

	}
};

module.exports = roleAttacker;