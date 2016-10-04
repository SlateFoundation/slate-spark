/**
 * Provides a store for sparkpoint goals for students in a specific section.
 */
Ext.define('SparkClassroomTeacher.store.competencies.SectionGoals', {
	extend: 'Ext.data.Store',
	alias: 'store.sectiongoals',
    requires: [
        'Slate.proxy.API'
    ],


	config: {
		fields: [
            'term_id',
            'section_id',
            'sparkpoint_id',
            'goal',
            'term_title',
            'term_handle',
            'section_code',
            'sparkpoint_code'
        ],

		proxy: {
			type: 'slate-api',
			url: '/spark/api/sparkpoints/section/goals'
		}
	}
});