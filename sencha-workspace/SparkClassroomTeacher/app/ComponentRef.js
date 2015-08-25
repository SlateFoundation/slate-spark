/*
  Global class to get access to a particular controller reference dynamically
  based on it's section.  See get() description.
*/
// TODO: eliminate this class
Ext.define('SparkClassroomTeacher.ComponentRef', {
    singleton: true,

    // capitalizes the first letter of the passed in route and returns it
    capitalizeRouteString: function( route ){
      return route.charAt(0).toUpperCase() + route.substring(1, route.length);
    },

    /*
      Sencha takes all your controller refs and auto generates a get function for
      each ref and attaches it to the controller.
      example: ref named 'assignCmp' -> this.getAssignCmp();

      the code below is used to have dynamic access to these functions.  You pass
      in the controller and a 'section' and it builds the proper string and returns
      the result of function. A dependency of this is all ref names have to be
      formatted {sectionName} + 'Cmp'
    */
    get: function( controller, section ){
      return controller['get' + this.capitalizeRouteString( section ) + 'Cmp']();
    }
});
