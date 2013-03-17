/* global makeClass:true */

function each(obj, onSuccess, recursive) {
    if (obj) {
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            if (onSuccess) {
                var quit = onSuccess(val, key);
                if (false === quit) {
                    return false;
                }
            }
            if (true === recursive && (typeof val === 'object' || typeof val === 'array')) {
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

Object.defineProperties(Array.prototype, {
  '_where': { value:   function(func) { return filter(func, this); } }, 
  '_select': { value: function(func) { return map(func, this); } }
})

function select() {
    var query = this;
    
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    query.columns = query.columns || [];
    each(args, function(argumentValue) {
        query.columns.push(argumentValue);
    });
    return query;
    
}

function run() {
    var query = this;
    var ret = [];
    if(query.columns.length > 0) {
        var results =[];
         each(query.columns, function(columnName) {
             if (columnName) {
                 each(query.tables, function(tbl) {
                     if (Array.isArray(tbl)) {
                         var res = {};
                         var val = tbl._select(function(val) {
                             return val[columnName];
                         });
                         if (val) {
                             res[columnName] = val;
                             results.push(res);
                         }
                     }
                 }, true);
             }
         });
        
        each(results, function(val, key) {
            var returnRow = {};
            each(results, function(value, columnName) {
                if(key == columnName && query.columns.indexOf(columnName) !== -1) {
                    returnRow[columnName] = val;
                }
            }, true);
            if(Object.keys(returnRow).length > 0) {
                ret.push(returnRow);
            }
        }, true);
    }
    return results;
}

Object.defineProperties(Array.prototype, {
  'select': { value: select }, 
});

function from(array) {
    var query = this;
    query.tables.push(array);
    return query;
}

var query = function(array) {
   var tables = [];
   tables.push(array);
   var _query = {
       tables: tables,
       from: curryLeft(from, _query),
       select: curryLeft(select, _query),
       run: curryLeft(run, _query)       
   };
   return _query;
};

