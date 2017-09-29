var formula_roll = function(str) {
    str = str.replace(/(\s+)/g, ''); //removing whitespaces
    var dices = str.split(/[+-]/g); //getting formulas for all dicerolls
    var signs = str.split(/[^+-]/g).filter(function(el){return el !== ''}); //getting signs between dice rolls
    if(dices.length - signs.length !== 0) {
        if(dices.length - signs.length === 1) signs.unshift('+'); //if the first roll was w/o minus(-) we add plus(+)
        else throw Error('Nope!'); //else sth is wrong
    }

    //converting +/- to 1/-1
    for(i = 0; i < signs.length; ++i) {
        if(signs[i] === '+') signs[i] = 1;
        else if(signs[i] === '-') signs[i] = -1;
        else signs[i] = 0;
    }

    rolls = [];

    //rolling each dice
    for(var i = 0; i < dices.length; ++i) {
        if(!/^[1-9]\d*[d][1-9]\d*$/.test(dices[i]) && !/^[1-9]\d*$/.test(dices[i])) throw Error('Nope!');
        var diceroll = dices[i].split(/[d]/);
        var number = Math.abs(parseInt(diceroll[0]));
        if(diceroll[1] != undefined) { //if dice is not a constant - roll it
            var dice = parseInt(diceroll[1]);
            for(var roll = []; number > 0; --number) roll.push(signs[i] * (Math.floor(Math.random() * dice) + 1));
            rolls.push(roll);
        }
        else rolls.push([number]); //else write the constant as a roll
    }

    return(rolls); //result is an array of all rolls, which are also arrays of separate dice rolls with corresponding signs
}

console.log(formula_roll("1d4 + 3d8"));

//returns the additional dice based on attribute score
var attr_dice = function(score) {
    switch(score) {
        case 0: return [0];
        case 1: return [1, 4];
        case 2: return [1, 6];
        case 3: return [1, 8];
        case 4: return [1, 10];
        case 5: return [2, 6];
        case 6: return [2, 8];
        case 7: return [2, 10];
        case 8: return [3, 8];
        case 9: return [3, 10];
        case 10: return [4, 8]; 
        default: throw Error('Invalid score value!');
    }
}

var dice_roll = function(score, advantage, disadvantage) {
    if(score < 0 || score > 10) throw Error('Invalid score value!');
    if(advantage < 0 || disadvantage < 0) throw Error('Advantage or disadvantage must be non-negative integers');
    var modifier = advantage - disadvantage;
    var sgn = Math.sign(modifier); //shows whether to treat result as an advantage or disadvantage
    modifier = Math.abs(modifier); //number of additional dice rolled
    if(score === 0) var dice = [1, 20]; //if score is zero, no additional dice is needed
    else var dice = attr_dice(score);
    if(score === 0 && modifier > 1) modifier = 1; //if the score is zero, (dis)advantage cannot be greater than one

    var number = dice[0] + modifier; //number of total dice rolled
    var rolls = [];

    //rolling first series of dice
    for(var num = number; num > 0; --num) rolls.push(Math.floor(Math.random() * dice[1]) + 1);

    //getting the appropriate number of highest/lowest rolls
    if(sgn !== 0) rolls = (rolls.sort(function(a, b) {return sgn * (b - a)})).slice(0, dice[0]);

    //once the rolls are picked we check for explosions and roll additional dice until 
    number = 0;
    for(var i = 0; i < rolls.length; ++i) if(rolls[i] === dice[1]) ++number;
    for(var num = number; num > 0; --num) {
        rolls.push(Math.floor(Math.random() * dice[1]) + 1);
        if(rolls[rolls.length - 1] === dice[1]) ++num;
    }

    //if the score is not zero we need to roll d20 and check for explosions
    if(sgn !== 0) {
        for(var num = 1; num > 0; --num) {
            rolls.unshift(Math.floor(Math.random() * 20) + 1);
            if(rolls[0] === 20) ++num;
        }
    }

    return rolls.reduce(function(a, b) { return a + b;}); //summing the results
}

//tests:
//console.log('---(2, 0, 0)---');
//dice_roll(2, 0, 0);
//console.log('---(3, 3, 0)---');
//dice_roll(3, 3, 0);
//console.log('---(3, 0, 3)---');
//dice_roll(3, 0, 3);
//console.log('---(5, 2, 0)---');
//dice_roll(5, 2, 0);
//console.log('---(5, 0, 2)---');
//dice_roll(5, 0, 2);

//P.S.: all printing can be eliminated (DONE)
//TO-DO: add argument checking (DONE)