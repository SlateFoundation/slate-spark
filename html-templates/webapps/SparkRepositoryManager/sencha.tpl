{extends "webapps/slate-sencha.tpl"}

{block meta}
    {capture assign=title}Spark Repository &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}
