/**
 * Created by  moxz on 2015/2/4.
 */
require.config({
    baseUrl: '/styles/js/libs/',
    config: {
        moment: {
            noGlobal: true
        }
    },
    paths: {
        jquery: '../libs/jquery-2.1.4',
        fuelux: '../libs/fuelux',
        underscore: '../libs/underscore-min',
        maskedInput: '../libs/jquery.maskedinput.min',
        bootstrap: '../libs/bootstrap.min',
        switchs: '../libs/bootstrap-switch.min',
        select: '../select/bootstrap-select.min',
        selectCN: '../select/i18n/defaults-zh_CN.min',
        table: '../table/bootstrap-table.min',
        editable: '../table/extensions/editable/bootstrap-table-editable',
        xeditable: '../table/extensions/editable/bootstrap-editable',
        tablezn: '../table/locale/bootstrap-table-zh-CN.min',
        tExport: '../table/extensions/export/bootstrap-table-export.min',
        tExportS: '../table/extensions/export/tableExport',
        base64: '../table/extensions/export/jquery.base64',
        select2: '../select2/select2.full.min',
        validator: '../validator/js/formValidation.min',
        vb: '../validator/js/framework/bootstrap.min',
        message: '../../sco/js/sco.message',
        validatorLAG: '../validator/js/language/zh_CN',
        hideShowPassword: '../libs/hideShowPassword.min',
        json2: '../libs/json2',
        comm: '../module/comm',
        form: '../module/form',
        async: '../libs/async',
        scomodal:'../../sco/js/sco.modal',
        scoconfirm:'../../sco/js/sco.confirm',
        newsbox: '../libs/jquery.bootstrap.newsbox',
        ie10: '../libs/ie10-viewport-bug-workaround',
        summernote: '../summernote/summernote',
        codemirrorxml: '../codemirror/mode/xml/xml.min',
        codemirrormin: '../codemirror/codemirror.min',
        codemirrorformatting: '../codemirror/formatting.min',
        highlight: '../highlight/highlight.min',
        summernote_lang: '../summernote/summernote-zh-CN',
        tabshow: '../tabshow/tabshow',
        lazyload: '../libs/lazyload'
    },
    shim: {
        bootstrap: { deps: ['jquery'] , exports : 'bootstrap' },
        validator: { deps: ['jquery'], exports : 'validator'},
        select: { deps: ['jquery'] , exports :'select'},
        maskedInput: { deps: ['jquery'] , exports :'maskedInput'},
        select2: { deps: ['jquery'] , exports :'select2'},
        switchs: { deps: ['jquery'] , exports :'switchs'},
        fuelux: { deps: ['jquery'] , exports :'fuelux' },
        table: { deps: ['jquery']  , exports :'table'},
        editable: { deps: ['jquery']  , exports :'editable'},
        xeditable: { deps: ['jquery']  , exports :'xeditable'},
        tExportS: { deps: ['jquery'] , exports :'tExportS' },
        base64: { deps: ['jquery']  , exports :'base64'},
        tablezn: { deps: ['table'] , exports :'tablezn' },
        tExport: { deps: ['table','tExportS','base64'] , exports :'tExport' },
        vb: { deps: ['validator'] , exports :'vb' },
        message: { deps: ['jquery'] , exports :'message' },
        selectCN: { deps: ['jquery','select']  , exports :'selectCN'},
        validatorLAG: { deps: ['validator']  , exports :'validatorLAG'},
        comm: { deps: ['jquery']  , exports :'comm'},
        form: { deps: ['jquery']  , exports :'form'},
        summernote: { deps: ['jquery','bootstrap']  , exports :'summernote'},
        codemirrormin: { deps: ['jquery']  , exports :'codemirrormin'},
        highlight: { deps: ['jquery']  , exports :'highlight'},
        codemirrorxml: { deps: ['codemirrormin']  , exports :'codemirrorxml'},
        codemirrorformatting: { deps: ['codemirrorxml']  , exports :'codemirrorformatting'},
        summernote_lang: { deps: ['summernote']  , exports :'summernote_lang'},
        lazyload: { deps: ['jquery']  , exports :'lazyload'},
        tabshow: { deps: ['jquery','lazyload']  , exports :'tabshow'}
    }
});