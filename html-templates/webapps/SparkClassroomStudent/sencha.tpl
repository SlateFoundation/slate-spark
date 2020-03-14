{extends "webapps/slate-sencha.tpl"}

{block meta}
    {capture assign=title}Spark Student &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}
