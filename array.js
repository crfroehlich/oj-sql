function each(obj, onSuccess, recursive) {
    if (obj) {
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            if (onSuccess) {
                var quit = onSuccess(val);
                if (false === quit) {
                    return false;
                }
            }
            if (true === recursive) {
                each(val, onSuccess, true);
            }
        });
    }
}


function curryLeft(func) {
   var slice = Array.prototype.slice;
   var args = slice.call(arguments, 1);
   return function() {
       return func.apply(this, args.concat(args, slice.call(arguments, 0)));

   }
}

function foldLeft(func,newArray,oldArray) {
    var accumulation = newArray;
    each(oldArray, function(val) {
        accumulation = func(accumulation, val);
    });
    return accumulation;
    
}

function map(func, array) {
    var onIteration = function(accumulation, val) {
        return accumulation.concat(func(val));
    };
    return foldLeft(onIteration, [], array)
}

function filter(func, array) {
    var onIteration = function(accumulation, val) {
        if(func(val)) {
            return accumulation.concat(val);
        } else {
            return accumulation;
        }
    };
    return foldLeft(onIteration, [], array)
}

Array.prototype._where = function(func) { return filter(func, this); }
Array.prototype._select = function(func) { return map(func, this); }

function select() {
    var array = this;
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 0);
    var cols = [];
    each(args, function(argumentValue) {
        cols.push(array._select(function(val) { return val[argumentValue]; }));
    });
    var ret = [];
    if(cols.length === args.length && cols.length > 0) {
        var col = cols[0];
        
        for(var r=0; r < col.length; r += 1) {
            var thisRow = ret[r] || {};
            for(var c=0; c < cols.length; c += 1) {
                thisRow[args[c]] = cols[c][r];
            }
            ret.push(thisRow);
        }
    }
    
    return ret;
    
}
Array.prototype.select = select;

function from(array) {
    return array;
}


var peoples = [
    { FirstName : "John", LastName : "Doe", Age : 29 },
    { FirstName : "Jane", LastName : "Doe", Age : 33 },
    { FirstName : "Mary", LastName : "White", Age : 31 },
    { FirstName : "Barry", LastName : "White", Age : 31 },
    { FirstName : "Kevin", LastName : "Black", Age : 31 },
    { FirstName : "Anna", LastName : "Smith", Age : 1 }
    
];

