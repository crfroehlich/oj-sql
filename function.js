  Object.defineProperty(Function.prototype, 'inheritsFrom', {
      value: function(parentClassOrObject) {
          if (parentClassOrObject.constructor === Function) {
              //Normal Inheritance
              this.prototype = new parentClassOrObject();
              this.prototype.constructor = this;
              this.prototype.parent = parentClassOrObject.prototype;
          }
          else {
              //Pure Virtual Inheritance
              this.prototype = parentClassOrObject;
              this.prototype.constructor = this;
              this.prototype.parent = parentClassOrObject;
          }
          return this;
      }

  });

  function makeSubClass(inheritsFrom, constructorCallBack) {

      var ret = function () {
         var slice = Array.prototype.slice;
         var args = slice.call(arguments, 0);
         try {
              if (inheritsFrom) {
                  inheritsFrom.apply(this, args);
              }
              if(constructorCallBack) {
                constructorCallBack.apply(this, args);
              }
          }
          catch (e) {
              console.error(e);
          }
      };
      if (inheritsFrom) {
          ret.inheritsFrom(inheritsFrom);
      }
      return ret;
  }