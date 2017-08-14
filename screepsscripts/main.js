require('prototype.spawn')();

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
//var roleWallRepairer = require('role.wallRepairer');
var roleLongDistanceHarvester = require('role.longDistanceHarvester');
var roleClaimer = require('role.claimer');
var roleMiner = require('role.miner');
var roleTransporter = require('role.transporter');
var roleAttacker = require('role.attacker');
var roleHealer = require('role.healer');

var funcTower = require('tower.func');

var HOME = Game.spawns.Spawn1.room.name;
//WARNING WILL NOT WORK WHEN the current home rome has no adjacent rooms
//automation
var roomLeft = HOME.slice(0, 2) + (parseInt(HOME[2]) - 1) + HOME.slice(3, 6);
var roomRight = HOME.slice(0, 2) + (parseInt(HOME[2]) + 1) + HOME.slice(3, 6);
var roomTop = HOME.slice(0, 5) + (parseInt(HOME[5]) - 1);
var roomDown = HOME.slice(0, 5) + (parseInt(HOME[5]) + 1);

/*
var roomTop = 'E72S46';
var roomDown = 'E72S48';
var roomLeft = 'E71S47';
var roomRight = 'E73S47';
*/

//manuallly add a memory to the spawn1 memory
//Game.spawns.Spawn1.memory.claimRoom = 'E73S47';

 //for multi rooming, change these variables, and store them into the memory of spawns
/*
Game.spawns.Spawn1.memory.minHarvesters = 2;
Game.spawns.Spawn1.memory.minUpgraders = 2;
Game.spawns.Spawn1.memory.minBuilders = 1;
Game.spawns.Spawn1.memory.minRepairers = 1;
Game.spawns.Spawn1.memory.minLongDistHarvestersRoomRight = 0;
*/

module.exports.loop = function(){

    for(let spawnName in Game.spawns){
        let spawn = Game.spawns[spawnName];
        let creepsInRoom = spawn.room.find(FIND_MY_CREEPS);
        var name;
        

        var energy;
        //spawn proper size creep with
        if (spawn.room.energyAvailable < 300){
            energy = 300;
        }
        else{
            energy = spawn.room.energyAvailable;
        }

//        var test = Bentley;
//        console.log(Game.creeps.test.id);

        //setup minimum numbers for different roles every time starting a new room
/*
        var minimumNumberOfHarvesters = 2;
        var minimumNumberOfUpgraders = 2;
        var minimumNumberOfBuilders = 1;
        var minimumNumberOfRepairers = 1;
        var minimumNumberOfWallRepairers = 0;
        var minimumNumberOfLongDistanceHarvestersRoomTop = 0;
        var minimumNumberOfLongDistanceHarvestersRoomDown = 0;
        var minimumNumberOfLongDistanceHarvestersRoomLeft = 0;
        var minimumNumberOfLongDistanceHarvestersRoomRight = 0;
*/

        //count the total amount of harvesters in a room
        var numberOfHarvesters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'harvester');
        var numberOfBuilders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'builder');
        var numberOfUpgraders = _.sum(creepsInRoom, (creep) => creep.memory.role == 'upgrader');
        var numberOfRepairers = _.sum(creepsInRoom, (creep) => creep.memory.role == 'repairer');
        var numberOfMiners = _.sum(creepsInRoom, (creep) => creep.memory.role == 'miner');
        var numberOfTransporters = _.sum(creepsInRoom, (creep) => creep.memory.role == 'transporter');

/*
        console.log(numberOfHarvesters);
        console.log(numberOfBuilders);
        console.log(numberOfUpgraders);
        console.log(numberOfRepairers);
        console.log(numberOfMiners);
        console.log(numberOfTransporters);
*/
    //    var numberOfWallRepairers = _.sum(Game.creeps, (creep) => creep.memory.role == 'wallRepairer');
    //    var numberOfLongDistanceHarvestersRoomTop = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomTop);
    //    var numberOfLongDistanceHarvestersRoomDown = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomDown);
    //    var numberOfLongDistanceHarvestersRoomLeft = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomLeft);
        var numberOfLongDistanceHarvestersRoomRight = _.sum(Game.creeps, (creep) => creep.memory.role == 'longDistanceHarvester' && creep.memory.target == roomRight);

        //ultimate situation with no harvesting mechanism existing
        //if there is no harvesters or either miners or transporters
        if (numberOfHarvesters == 0 && (numberOfMiners == 0 || numberOfTransporters == 0)){
            /*
            let transporterEnergy = energy;
            if (transporterEnergy > 450){
                transporterEnergy = 450;
            }
            */

            //case no transporter or harvester
            //if there are miners, only need transporters to back on track
            if (numberOfMiners > 0){
                if (spawn.room.energyAvailable < 300)
                    energy = 300;
                else if(spawn.room.energyCapacityAvailable > 1000)
                    energy = 1000;
                else
                    energy = spawn.room.energyAvailable;
                name = spawn.createTransporter(energy);
            }
            //else, there is not extractor mining, one default harvester is enough to back on track
            else {
                console.log('Here');
                if (spawn.room.energyAvailable < 300)
                    energy = 300;  
                else if(spawn.room.energyCapacityAvailable > 1000)
                    energy = 1000;
                else
                    energy = spawn.room.energyAvailable;
                name = spawn.createCustomCreep(energy, 'harvester');
                console.log(name);
            }
        }
        //if no need for backup harvester:
        else {
            let sources = spawn.room.find(FIND_SOURCES);
            for(let source of sources){
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.srcId == source.id)){
                    let container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: s => s.structureType == STRUCTURE_CONTAINER && !s.progress
                    })[0];
                    if (container){
                        name = spawn.createMiner(energy, source.id);
                        break;
                    }
                }
            }
        }

        /*
        if (spawn == Game.spawns.Spawn2){
            console.log(numberOfHarvesters);
            console.log(spawn.memory.minHarvesters);
        }
        */

        //testing
        /*
        var source0 = Game.spawns.Spawn1.room.find(FIND_SOURCES)[0];
        //console.log(source0);
        let test = source0.pos.isNearTo(FIND_STRUCTURES, {
            filter: s=> s.structureType == STRUCTURE_CONTAINER
        });
        //console.log(test);
        var container0 = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });
        console.log(container0 == test);
*/
        //

        
        if (name == undefined|| name < 0){

            //set up automatically spawning new harvester when the amount is below minimum
            //spawn transporters
            let containers = spawn.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE)}
            });
            if((numberOfTransporters < spawn.memory.minTransporters) && containers){
                name = spawn.createTransporter(energy);
            }
            else if (numberOfHarvesters < spawn.memory.minHarvesters){
                name = spawn.createCustomCreep(energy, 'harvester');
            }
            else if (numberOfUpgraders < spawn.memory.minUpgraders){
                name = spawn.createCustomCreep(energy, 'upgrader', 1);
            }
            else if (numberOfRepairers < spawn.memory.minRepairers){
                name = spawn.createCustomCreep(energy, 'repairer', 0);
            }
            else if (numberOfBuilders < spawn.memory.minBuilders){
                name = spawn.createCustomCreep(energy, 'builder', 0);
                //console.log(JSON.stringify(name));
                //name = Game.spawns['Spawn1'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {role:'builder', src:0, working: false});
                //console.log('Spawning new builder:' + newName);
            }
            else if (spawn.memory.claimRoom){ // != undefined
                name = spawn.createClaimer(spawn.memory.claimRoom);
                if (!(name < 0)){
                    delete spawn.memory.claimRoom;
                }
            }
            else if (numberOfLongDistanceHarvestersRoomRight < spawn.memory.minLDHRoomRight){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomRight, 2);
            }
            /*
            else if (numberOfWallRepairers < minimumNumberOfWallRepairers){
                name = Game.spawns.Spawn1.createCustomCreep(energy, 'wallRepairer', 0);
            }
            
            else if (numberOfLongDistanceHarvestersRoomTop < minimumNumberOfLongDistanceHarvestersRoomTop){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomTop, 0);
            }
            else if (numberOfLongDistanceHarvestersRoomDown < minimumNumberOfLongDistanceHarvestersRoomDown){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomDown, 0);
            }
            else if (numberOfLongDistanceHarvestersRoomLeft < minimumNumberOfLongDistanceHarvestersRoomLeft){
                name = Game.spawns.Spawn1.createLongDistanceHarvester(energy, 4, spawn.room.name, roomLeft, 0);
            }
            */
        }

        if (!(name < 0) && name != undefined){
            console.log(spawnName + ' spawned ' + Game.creeps[name].memory.role + ' ' + name);
            console.log('Harvesters    :' + numberOfHarvesters);
            console.log('Upgraders     :' + numberOfUpgraders);
            console.log('Builders      :' + numberOfBuilders);
            console.log('Repairers     :' + numberOfRepairers);
            console.log('Miners        :' + numberOfMiners);
            console.log('Transporters  :' + numberOfTransporters);
        }



        //let tower run funcs
        var towers = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for (let tower of towers){
    		//var tower = towers[name];
    		funcTower.run(tower);
    	}

        //setup creep to run different role scripts
        for (let name in Game.creeps){
            var creep = Game.creeps[name];

            if (creep.ticksToLive <= 10){
                creep.moveTo(spawn);
            }
            
            //auto renew creep when the creep is near spawn
            if (creep.pos.isNearTo(spawn) && creep.ticksToLive < 1460){
                spawn.renewCreep(creep);
                creep.transfer(spawn, RESOURCE_ENERGY);
                //console.log(creep.name + creep.transfer(spawn));
            }

            if (creep.memory.role == 'harvester'){
                roleHarvester.run(creep);
            }
            else if (creep.memory.role == 'upgrader'){
                roleUpgrader.run(creep);
            }
            else if (creep.memory.role == 'builder'){
                roleBuilder.run(creep);
            }
            else if (creep.memory.role == 'repairer'){
                roleRepairer.run(creep);
            }
            else if (creep.memory.role == 'longDistanceHarvester'){
                roleLongDistanceHarvester.run(creep);
            }
            else if (creep.memory.role == 'claimer'){
                roleClaimer.run(creep);
                //creep.moveTo(7, 48);
            }
            else if (creep.memory.role == 'miner'){
                roleMiner.run(creep);
            }
            else if (creep.memory.role == 'transporter'){
                roleTransporter.run(creep);
            }
            else if (creep.memory.role == 'attacker'){
                    roleAttacker.run(creep);
                    /*
                    if(creep.memory.room == creep.room.name && creep.room.name == "E18N97"){
                        creep.moveTo(7, 1);
                    }
                    else if(creep.memory.room == creep.room.name && creep.room.name == "E18N98"){
                        creep.moveTo(7, 48);
                    }
                    */
                //
                //console.log(creep.moveTo(7, 22));
                /*
                if(creep.moveTo(40, 11) == -2){
                    if(creep.memory.targetWall){
                        if(creep.attack(Game.getObjectById(creep.memory.targetWall)) == ERR_NOT_IN_RANGE){
                            creep.moveTo(Game.getObjectById(creep.memory.targetWall));
                        }
                        else if(Game.getObjectById(creep.memory.targetWall)) == ERR_INVALID_TARGET){
                            delete creep.memory.targetWall;
                        }
                    }
                    else{
                        let closestWall = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => (structure.structureType == STRUCTURE_WALL)
                        });
                        if(closestWall){
                            creep.memory.targetWall= closestWall.id;
                            console.log(creep.attack(creep.memory.target));

                        }
                    }
                }
                */
                

            }
            else if (creep.memory.role == 'healer'){
                roleHealer.run(creep);
            }
            /*
            else if (creep.memory.role == 'wallRepairer'){
                roleWallRepairer.run(creep);
            }
            */
        }

        //clear memory of dead creep to avoid memory overflow when spawning new creep with same name
        for (let name in Memory.creeps){
        	if (!Game.creeps[name]){
        		delete Memory.creeps[name];
        	}
        }

        if(spawn == Game.spawns.Spawn3){
            for(let name in creepsInRoom){
                let creep = creepsInRoom[name];
                if(creep.memory.role == 'builder' && creep.ticksToLive < 700){
                    creep.moveTo(Game.spawns.Spawn3);
                }
            }
        }



    }
}
//spawn builder
Game.spawns.Spawn1.createCustomCreep(Game.spawns.Spawn1.room.energyCapacityAvailable, 'builder', null, 'E19N95')


//spawn attacker
/*
name = Game.spawns.Spawn1.createAttacker(Game.spawns.Spawn1.room.energyCapacityAvailable, Game.spawns.Spawn1.room.name, 'roomName', false)

*/


//spawn healer
/*
name = Game.spawns.Spawn1.createHealer(Game.spawns.Spawn1.room.energyCapacityAvailable, Game.spawns.Spawn1.room.name, Game.creeps.[NAME].id);


*/

/*
            var guards = [];
            for(let name in Game.creeps){
                let creep = Game.creeps[name];
                if (creep.memory.role == 'attacker' && creep.memory.target == 'E73S48'){
                    //console.log(creep);
                    creep.memory.attacking = true;
                    guards.push(creep);
                }
            }

                //console.log(guards.length);
            if(guards.length < 1){
                let test = Game.spawns.Spawn2.createAttacker(140, Game.spawns.Spawn2.room.name, 'E73S48');
            }

        var attackers = [];
        for(var name in Game.creeps) {
            let creep = Game.creeps[name];
            if(creep.memory.role == 'attacker' && creep.memory.target == 'E72S46') {
                creep.memory.attacking = true;
                attackers.push(creep);
            }
        }
        for (var i = 0; i < attackers.length; i ++){
            //console.log(JSON.stringify(attackers[i]));
        }
*/