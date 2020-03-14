{extends "webapps/slate-sencha.tpl"}

{block meta}
    {capture assign=title}Spark Teacher &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}
