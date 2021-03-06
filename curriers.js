function each(obj, onSuccess, recursive) {
    if (obj && (typeof obj === 'object' || typeof obj === 'array')) {
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            if (onSuccess && val && key) {
                var quit = onSuccess(val, key);
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
       return func.apply(this, args.concat(slice.call(arguments, 0)));

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