Ext.define('SparkClassroom.column.Assignments', {
    extend: 'Ext.grid.column.Column',
    xtype: 'spark-column-assignments',
    requires: [
        'Ext.util.Format',
        'SparkClassroom.assign.Popup'
    ],

    mixins: [
        'Ext.mixin.Queryable'
    ],

     /**
     * @event beforetriggertap
     * Fires before assignment students popup is shown and allows it to be canceled
     * @param {Ext.grid.cell.Cell} assignmentsCell The cell the trigger was clicked in
     */

     /**
     * @event triggertap
     * Fires after an assignment students popup is shown
     * @param {Ext.grid.cell.Cell} assignmentsCell The cell the trigger was clicked in
     */

     /**
     * @event beforeflagtap
     * Fires before the flagtap event gets fired and allows it to be canceled
     * @param {Ext.grid.cell.Cell} assignmentsCell The cell the flag was clicked in
     * @param {String} flagId The id of the flag that was clicked
     * @param {Ext.dom.Element} flagEl The element for the flag thath was clicked
     */

     /**
     * @event flagtap
     * Fires when a flag within an assignments cell has been clicked
     * @param {Ext.grid.cell.Cell} assignmentsCell The cell the flag was clicked in
     * @param {String} flagId The id of the flag that was clicked
     * @param {Ext.dom.Element} flagEl The element for the flag thath was clicked
     */


    config: {
        showTrigger: true,
        studentsStore: 'Students',
        activeStudentsStore: 'gps.ActiveStudents',
        flags: [
            {
                id: 'required',
                text: 'Required',
                icon: 'asterisk'
            }
        ],
        popup: null,
        popupCell: null,

        sortable: false, // TODO: properly configure sorting
        text: null,
        width: null,

        dataIndex: 'assignments',
        cls: 'spark-column-assignments',
        cell: {
            encodeHtml: false,
            listeners: [{
                element: 'element',
                delegate: '.menu-trigger',
                tap: function(ev, t) {
                    var me = this,
                        column = me.getColumn(),
                        popup = column.getPopup();

                    if (false === me.fireEvent('beforetriggertap', me)) {
                        return;
                    }

                    if (popup && column.getPopupCell() === me) {
                        column.setPopupCell(null);
                    } else {
                        column.setPopupCell(me);
                    }

                    me.fireEvent('triggertap', me);
                }
            },{
                element: 'element',
                delegate: 'li[data-flag]',
                tap: function(ev, t) {
                    var me = this,
                        column = me.getColumn(),
                        record = me.getRecord(),
                        flagEl = ev.getTarget('li', null, true),
                        flagId = flagEl.getAttribute('data-flag'),
                        parentColumn = column.up('spark-column-assignments'),
                        parentRecord = parentColumn && parentColumn.getPopupCell().getRecord();

                    if (false === me.fireEvent('beforeflagtap', me, flagId, record, parentRecord, flagEl)) {
                        return;
                    }

                    me.fireEvent('flagtap', me, flagId, record, parentRecord, flagEl);
                }
            }]
        },
        renderer: function(assignments, record) {
            var me = this,
                htmlEncode = Ext.util.Format.htmlEncode,
                student = record.get('student'),
                studentIdStrings = me.studentIdStrings || [],
                studentsCount = studentIdStrings.length,

                flags = me.getFlags(),
                flagsLength = flags.length,
                i = 0, flag, flagId,
                fillCls, sourceCls,
                matchingStudents, notMatchingStudents, assignmentKey, assignment,

                out = [];

            // grab things we need quick access to inside the loop
            assignments = assignments || {};

            // render list of flags based on assignments
            out.push('<ul class="assign-control-list">');

            for (; i < flagsLength; i++) {
                flag = flags[i];
                flagId = flag.id;
                fillCls = 'is-empty';
                sourceCls = '';

                // determine cls for student or section
                if (student) {
                    if (assignments.student == flagId) {
                        fillCls = 'is-full';
                        sourceCls = 'is-direct';
                    } else if (
                        (!assignments.student || assignments.student == 'exempt')
                        && assignments.section == flagId
                    ) {
                        fillCls = 'is-full';
                        sourceCls = 'is-indirect';
                    }
                } else {
                    matchingStudents = 0;
                    notMatchingStudents = 0;

                    for (assignmentKey in assignments) {
                        // skip section assignment or students not in current roster
                        if (assignmentKey == 'section' || studentIdStrings.indexOf(assignmentKey) == -1) {
                            continue;
                        }

                        assignment = assignments[assignmentKey];

                        if (assignment == flagId) {
                            matchingStudents++;
                        } else if (assignment) {
                            notMatchingStudents++;
                        }
                    }

                    if (
                        matchingStudents == studentsCount
                        || (
                            assignments.section == flagId
                            && notMatchingStudents == 0
                        )
                    ) {
                        fillCls = 'is-full';
                    } else if (matchingStudents) {
                        fillCls = 'is-partial';
                    }

                    if (assignments.section == flagId) {
                        sourceCls = 'is-direct';
                    } else if (matchingStudents) {
                        sourceCls = 'is-indirect';
                    }
                }

                out.push(
                     // Supported states: is-full, is-empty, is-partial
                    '<li class="assign-control-item '+fillCls+' '+sourceCls+'" title="'+htmlEncode(flag.text)+'" data-flag="'+flag.id+'">',
                        '<div class="assign-control-frame">',
                            '<div class="assign-control-indicator"></div>',
                        '</div>',
                    '</li>'
                );
            }

            if (me.getShowTrigger()) {
                out.push(
                    '<li class="assign-control-item">',
                        '<div class="menu-trigger"><i class="fa fa-lg fa-angle-down"></i></div>',
                    '</li>'
                );
            }

            out.push('</ul>');

            return out.join('');
        }
    },


    // method overrides
    /**
     * Implements required Ext.mixin.Queryable method so that the popup
     * container can be discovered as a child component
     */
    getRefItems: function() {
        var popup = this.getPopup();
        return popup ? [popup] : [];
    },


    // config handlers
    applyStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStudentsStore: function(store, oldStore) {
        var me = this;

        if (oldStore) {
            oldStore.un('load', 'onStudentsStoreLoad', me);
        }

        if (store) {
            me.studentIdStrings = store.getStudentIdStrings();
            store.on('load', 'onStudentsStoreLoad', me);
        }
    },

    applyActiveStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateFlags: function(flags)  {
        var me = this,
            htmlEncode = Ext.util.Format.htmlEncode,
            flagsLength = flags.length,
            i = 0, flag,
            textOut = [],
            width = 16;

        // generate column text and column width
        textOut.push('<div class="flex-ct">');

        for (; i < flagsLength; i++) {
            flag = flags[i];

            textOut.push(
                '<div class="flex-1 text-center">',
                    '<i class="fa fa-lg fa-'+flag.icon+'" title="'+htmlEncode(flag.text)+'"></i>',
                '</div>'
            );

            width += 32;
        }

        if (me.getShowTrigger()) {
            textOut.push('<div class="flex-1"></div>');

            width += 32;
        }

        textOut.push('</div>');

        // write dynamic configuration
        me.setText(textOut.join(''));
        me.setWidth(width);
    },

    updatePopupCell: function(cell, oldCell) {
        var me = this,
            popup = me.getPopup(),
            containingScrollable = me.containingScrollable,
            activeStudentsStore = me.getActiveStudentsStore(),

            studentsStore = me.getStudentsStore(),
            studentsCount = studentsStore.getCount(),
            i = 0, student, studentId,

            record, assignments,
            popupStore, assignCellEl, x, y, scrollable,
            headerCt, finishShow;

        if (!cell) {
            popup.hide();
            return;
        }

        // read record and assignments for cell
        record = cell.getRecord();
        assignments = record.get('assignments') || {};

        if (record instanceof SparkClassroom.model.StudentSparkpoint) {
            Ext.Logger.warn('Cannot set popupCell to one bound to a student');
            return;
        }

        // find container that provides scrolling
        if (!containingScrollable) {
            containingScrollable = me.containingScrollable = me.up('grid').up(':scrollable') || Ext.Viewport;
        }

        // create and render popup the first time it's needed
        if (!popup) {
            me.setPopup(popup = Ext.create('SparkClassroom.assign.Popup', {
                hidden: true,
                flags: me.getFlags()
            }));

            // use this column as the parent of the popup for the component hierarchy
            popup.setParent(me);

            // render popup to the containing scroll surface
            popup.setRenderTo(containingScrollable.innerElement);
        }

        // initially display popup invisibly so it can be measured
        popup.setVisibility(false);
        popup.show();

        // populate grid data
        popupStore = popup.getGrid().getStore();
        popupStore.beginUpdate();

        popupStore.removeAll(true);

        for (; i < studentsCount; i++) {
            student = studentsStore.getAt(i);
            studentId = student.getId();

            popupStore.add({
                id: studentId,
                student: student,
                studentSparkpoint: activeStudentsStore.findRecord('student_id', studentId),
                assignments: {
                    section: assignments.section,
                    student: assignments[studentId]
                }
            });
        }

        popupStore.endUpdate();

        // start positioning at bottom-left corner of assign cell
        assignCellEl = cell.element;
        x = assignCellEl.getLeft();
        y = assignCellEl.getBottom();

        // shift to accomodate scrollable parent
        scrollable = containingScrollable.getScrollable();
        if (scrollable) {
            y += scrollable.getPosition().y;
            y -= scrollable.getElement().getTop();
        }

        // show and position tip -- doesn't seem to have any styling at all
        // tipEl.show();
        // tipEl.addCls('x-anchor-top');

        // shift popup left by width of each column until the assignments column
        headerCt = popup.down('headercontainer');

        finishShow = function() {
            var assignmentsColumnOffset = 0;

            headerCt.items.each(function(column) {
                if (column.isXType('spark-column-assignments')) {
                    return false;
                }

                assignmentsColumnOffset += column.getWidth();
            });

            popup.setLeft(x - assignmentsColumnOffset);
            popup.setTop(y);
            popup.setVisibility(true);
        };

        // ensure grid's header container is painted before measuring column to align and finish showing
        if (headerCt.isPainted()) {
            finishShow();
        } else {
            headerCt.on('painted', finishShow, null, { single: true });
        }
    },


    // event handlers
    onStudentsStoreLoad: function(store) {
        this.studentIdStrings = store.getStudentIdStrings();
    }
});