  Object.defineProperty(Function.prototype, 'inheritsFrom', { value: function(parentClassOrObject) {
        if (parentClassOrObject.constructor === Function) {
            //Normal Inheritance
            this.prototype = new parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject.prototype;
        } else {
            //Pure Virtual Inheritance
            this.prototype = parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject;
        }
        return this;
    }
    
    });

function makeClass(name, inheritsFrom, callBack) {
        
        var ret = function name() {
            try {
                if(inheritsFrom ) {
                    inheritsFrom.apply(this, Array.prototype.slice.call(arguments, 0));
                }
                callBack.apply(this, Array.prototype.slice.call(arguments, 0));
            } catch(e) {
                console.error(e);
            }
        };
        if(inheritsFrom) {
            ret.inheritsFrom(inheritsFrom);
        }
        return ret;
    }
    
    