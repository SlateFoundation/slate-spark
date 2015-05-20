/*jslint browser: true, undef: true *//*global Ext*/

Ext.define('Spark2Manager.Application', {
    requires: [
        'Emergence.util.API',
        'Ext.Error',
        'Ext.data.StoreManager',
        'Ext.plugin.Viewport',
        'Spark2Manager.overrides.AbstractAPI',
        'Spark2Manager.overrides.grid.RowEditor',
        'Spark2Manager.store.AssessmentTypes',
        'Spark2Manager.store.Assessments',
        'Spark2Manager.store.Comments',
        'Spark2Manager.store.GradeLevels',
        'Spark2Manager.store.Links',
        'Spark2Manager.store.Ratings',
        'Spark2Manager.store.StandardMappings',
        'Spark2Manager.store.StandardRefs',
        'Spark2Manager.store.Standards',
        'Spark2Manager.store.StandardsTree',
        'Spark2Manager.store.TagMaps',
        'Spark2Manager.store.Tags',
        'Spark2Manager.store.VendorDomains',
        'Spark2Manager.store.Vendors'
    ],

    extend: 'Ext.app.Application',
    
    name: 'Spark2Manager',

    controllers: [
        'Learn',
        'Conference',
        'Apply',
        'Assess'
    ],

    listen: {
        controller: {
            '#': {
                unmatchedroute: 'onUnmatchedRoute'
            }
        }
    },

    defaultToken : 'learn',

    // TODO: @themightychris this is a hack for routing to the tab panel, could use some help here
    onUnmatchedRoute: function(hash) {
        this.setDefaultToken(hash);
    },

    stores: [
        'Assessments',
        'AssessmentTypes',
        'Comments',
        'GradeLevels',
        'Links',
        'Ratings',
        'Standards',
        'StandardsTree',
        'StandardMappings',
        'StandardRefs',
        'Tags',
        'TagMaps',
        'Vendors',
        'VendorDomains'
    ],

    views: [
        'Main'
    ],

    launch: function () {
        var me = this;

        if (location.hostname !== 'localhost' && location.hostname !== 'slate.ninja') {
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                        (i[r].q = i[r].q || []).push(arguments)
                    }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            if (SiteEnvironment && SiteEnvironment.user && SiteEnvironment.user.Username) {
                ga('create', 'UA-63172269-1', { 'userId': SiteEnvironment.user.Username });
            } else {
                ga('create', 'UA-63172269-1', 'auto');
            }

            ga('send', 'pageview');

            Ext.Error.handle = function (err) {
                ga('send', 'exception', {
                    'exDescription': err.msg,
                    'exFatal':       true,
                    'appName':       err.sourceClass,
                    'appVersion':    err.sourceMethod
                });
            };

            /**
             * Google Analytics Feedback Widget
             * Version 1.0.6 by Xavi Esteve
             * http://xaviesteve.com
             */
            var Namespace=Namespace||{};(function(e,t){"use strict";t.gaf={css:"#gaf-button{text-decoration:none;position:fixed;top:10px;right:10px;background:#e21a22;color:#fff;padding:4px 7px;font-size:12px;border-top-left-radius:5px;border-top-right-radius:5px;z-index:999999999}#gaf-dialog{position:fixed;top:20%;left:25%;width:50%;background:rgba(255,255,255,0.9);box-shadow:0 0 25px #aaa;padding:20px;z-index:999999999}#gaf-dialog h5{text-align:center;font-size:24px;margin:0}#gaf-type{text-align:center}#gaf-type a{display:inline-block;width:24%;min-width:6em;text-align:center}#gaf-type a:hover{opacity:.7}#gaf-type a.active{font-weight:bold;text-decoration:underline}#gaf-text{text-align:center;width:100%}#gaf-submit{text-align:center;display:block;font-weight:bold;font-size:120%;padding:20px 0 10px}#gaf-submit:hover{opacity:.7}#gaf-dialog-close{position:fixed;top:19%;right:25%;padding:10px;font-size:24px;color:rgba(0,0,0,.3);line-height:1}@media only screen and (max-width:800px){#gaf-dialog{left:10%;width:80%}#gaf-dialog-close{right:10%}}",init:function(e){this.options=e;this.loadCss();this.loadHtml();this.loadButton()},loadCss:function(){e.head.innerHTML+="<style>"+this.css+"</style>"},loadHtml:function(){this.buttonHtml='<a id="gaf-button" style="" href="#">'+this.options.open+"</a>";this.dialogHtml='<div id="gaf-dialog"><h5>'+this.options.title+'</h5><a id="gaf-dialog-close" href="#">&times;</a>'+'<p id="gaf-type" data-type="'+this.options.option1+'">'+'<a class="active" href="#">'+this.options.option1+"</a>"+'<a href="#">'+this.options.option2+"</a>"+'<a href="#">'+this.options.option3+"</a>"+'<a href="#">'+this.options.option4+"</a>"+"</p>"+'<input id="gaf-text" type="text" placeholder="'+this.options.placeholder+'" maxlength="500">'+'<a id="gaf-submit" href="#">'+this.options.send+"</a>"},loadButton:function(){e.body.innerHTML+=this.buttonHtml;e.getElementById("gaf-button").addEventListener("click",function(e){t.gaf.loadDialog();e.preventDefault()},!1)},loadDialog:function(){e.getElementById("gaf-button").removeEventListener("click",function(){},!1);e.body.removeChild(e.getElementById("gaf-button"));e.body.innerHTML+=this.dialogHtml;e.getElementById("gaf-text").focus();e.getElementById("gaf-dialog-close").addEventListener("click",function(e){t.gaf.closeDialog();e.preventDefault()},!1);e.getElementById("gaf-type").addEventListener("click",function(e){t.gaf.changeType(e);e.preventDefault()},!1);e.getElementById("gaf-submit").addEventListener("click",function(e){t.gaf.sendFeedback();e.preventDefault()},!1)},closeDialog:function(){e.getElementById("gaf-dialog-close").removeEventListener("click",function(){},!1);e.getElementById("gaf-submit").removeEventListener("click",function(){},!1);e.getElementById("gaf-type").removeEventListener("click",function(){},!1);e.body.removeChild(e.getElementById("gaf-dialog"));this.loadButton()},changeType:function(t){var n=document.querySelectorAll("#gaf-type a");for(var r=0;r<n.length;r++)n[r].className="";if(t.target.tagName=="A"){e.getElementById("gaf-type").dataset.type=t.target.innerHTML;t.target.className="active"}e.getElementById("gaf-text").focus()},sendFeedback:function(){if(e.getElementById("gaf-text").value.length<1){document.getElementById("gaf-text").style.border="2px solid #c00";e.getElementById("gaf-text").focus();return!1}ga("send",{hitType:"event",eventCategory:"Feedback",eventAction:e.getElementById("gaf-type").dataset.type,eventLabel:e.getElementById("gaf-text").value,eventValue:1});alert(this.options.thankyou);this.closeDialog()}}})(document,Namespace);

            Namespace.gaf.init({
                'open': 'Feedback',
                'title': 'We would love to hear your thoughts!',
                'option1': 'Problem',
                'option2': 'Suggestion',
                'option3': 'Compliment',
                'option4': 'Other',
                'placeholder': 'Please enter your feedback here…',
                'send': 'Send',
                'thankyou': 'Thank you for your feedback!'
            });
        }

        // TODO: Remove this before production
        if (location.hostname.indexOf('slate.ninja') === -1 && location.hostname.indexOf('slatepowered') === -1) {
            Emergence.util.API.setHostname('slate.ninja');
        }

        Ext.StoreMgr.requireLoaded(['Vendors', 'VendorDomains', 'StandardsTree', 'AssessmentTypes'], function() {
            var mainView = me.getMainView().create({
                    plugins: 'viewport'
                }),
                tab = mainView.child('#' + me.getDefaultToken() + '-panel');

            if (tab) {
                mainView.suspendEvent('tabchange');
                mainView.setActiveItem(tab);
                mainView.resumeEvent('tabchange');
            }
        });
    }
});
