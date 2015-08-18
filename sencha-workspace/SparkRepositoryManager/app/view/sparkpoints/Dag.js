Ext.define('SparkRepositoryManager.view.sparkpoints.Dag', {
    extend: 'Jarvus.draw.DagContainer',
    xtype:    'srm-sparkpoints-dag',
    requires: [
        'Jarvus.draw.DagContainer',
        'Jarvus.draw.layout.MaxUpOrDown',
        'Jarvus.draw.layout.TopDown',
        'Jarvus.draw.layout.BottomUp'
    ],

    /*
     * Method: buildNode
     *
     * Build the shape of a node.
     *
     * Parameters: surface - the Ext.draw canvas, node - the node, x - the shape
     * horizontal coordinate, settings - the user settings : <settings>
     *
     * Returns: a shape
     *
     */
    buildNode : function(surface, node, x, settings) {
        var nodSettings = node.highlighted ? settings.highlightedNodes : settings.nodes,
            rectWidth = nodSettings.rect.width,
            rectHeight = nodSettings.rect.height,
            dotCount = node.dependencies_count,
            dots = [],
            dotHeight,
            dotStart,
            sprites,
            dummy,
            rect,
            rectBB,
            code,
            codeBB,
            codeWidth,
            codeHeight,
            codeX,
            codeY,
            title,
            titleBB,
            titleWidth,
            titleHeight,
            i = 0;

        sprites = Ext.create('Ext.draw.CompositeSprite', {
            surface: surface
        });

        // ? is it a dummy node ???
        if (node.dummy) {
            dummy = surface.add({
                type: 'circle',
                x: x,
                y: rectHeight / 2
            });

            dummy.setAttributes( settings.dummyNodes, true );
            sprites.add( dummy );
        }
        else {
            // build a rectangle around the code
            rect = surface.add({
                type: 'rect',
                x: x,
                y: 0,
                highlighted: node.highlighted
            });

            code = surface.add({
                type: 'text',
                x: x + nodSettings.code.marginWidth,
                y: nodSettings.code.marginHeight,
                text: node.code
            });

            rect.setAttributes( nodSettings.rect, true );
            code.setAttributes(nodSettings.code, true);

            codeBB = code.getBBox();
            codeWidth = codeBB.width + 2 * nodSettings.code.marginWidth + rect.attr['stroke-width'];
            codeHeight = codeBB.height + 2 * nodSettings.code.marginHeight + rect.attr['stroke-width'];

            title = surface.add({
                type: 'text',
                x: x + nodSettings.title.marginWidth,
                y: codeHeight+nodSettings.title.marginHeight,
                text: this.wordwrap(node.teacher_title,50,"\n" )
            });

            title.setAttributes(nodSettings.title, true);

            titleBB = title.getBBox();
            titleWidth = titleBB.width + 2 * nodSettings.title.marginWidth + rect.attr['stroke-width'];
            titleHeight = titleBB.height + 2 * nodSettings.title.marginHeight + rect.attr['stroke-width'];

            dotHeight = ( dotCount > 0) ? nodSettings.dot.radius*2 : 0;

            // check if we need to resize the rectangle
            if (Math.max(codeWidth,titleWidth) > rectWidth) {
                rect.setAttributes( {width: Math.max(codeWidth,titleWidth)}, true );
            }
            if ((codeHeight+titleHeight+dotHeight) > rectHeight) {
                rect.setAttributes( {height: codeHeight+titleHeight+dotHeight}, true );
            }

            rectBB = rect.getBBox();
            rect.width = rectBB.width;
            rect.height = rectBB.height;

            for (i =0; i <= dotCount-1; i++) {
                dotStart = x + nodSettings.dot.marginWidth + nodSettings.dot.radius;
                dots[i] = surface.add({
                    type: 'circle',
                    x: dotStart + (i*((nodSettings.dot.radius*2)+nodSettings.dot.marginWidth)),
                    y: rectBB.height - (nodSettings.dot.radius + nodSettings.dot.marginHeight),
                    radius: nodSettings.dot.radius,
                    fill: nodSettings.dot.fill,
                    highlighted: node.highlighted
                });
                dots[i].setAttributes(nodSettings.dot, true);
            }

            sprites.add(code);

            codeX = 2;
            codeY = codeBB.height/2;
            this.TRANSLATE(sprites, codeX, codeY);

            sprites.add(title);
            sprites.add(rect);

            for (i =0; i <= dotCount-1; i++) {
                sprites.add(dots[i]);
            }

            // center the cell vertically
            this.TRANSLATE(sprites, 0, (rectHeight-rectBB.height)/2);
        }
        sprites.redraw();

        return sprites;
    },

    // http://phpjs.org/functions/wordwrap/
    wordwrap: function(str, int_width, str_break, cut) {
      var m = ((arguments.length >= 2) ? arguments[1] : 75);
      var b = ((arguments.length >= 3) ? arguments[2] : '\n');
      var c = ((arguments.length >= 4) ? arguments[3] : false);

      var i, j, l, s, r;

      str += '';

      if (m < 1) {
        return str;
      }

      for (i = -1, l = (r = str.split(/\r\n|\n|\r/))
        .length; ++i < l; r[i] += s) {
        for (s = r[i], r[i] = ''; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j))
          .length ? b : '')) {
          j = c == 2 || (j = s.slice(0, m + 1)
            .match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(
              m)
            .match(/^\S*/))[0].length;
        }
      }

      return r.join('\n');
    }

});
