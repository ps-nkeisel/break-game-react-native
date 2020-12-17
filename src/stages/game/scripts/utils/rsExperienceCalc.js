export default function RSExp(){
 
    this.equate = function(xp){
        return Math.floor(xp + 300 * Math.pow(2, xp / 7));
    };
 
    this.level_to_xp = function(level){
        var xp = 0;
 
        for (var i = 1; i < level; i++)
            xp += this.equate(i);
 
        return Math.floor(xp / 4);
    };
 
    this.xp_to_level = function(xp){
        var level = 1;
 
        while (this.level_to_xp(level) < xp)
            level++;
 
        return level;
    };
 
}