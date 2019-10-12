var target = Game.spawns.Spawn1;
for(var i in Game.Creeps){
	Game.creeps[i].moveTo(target);
}

//Creep memory
Game.creeps.John.memory.role = 'harvester';