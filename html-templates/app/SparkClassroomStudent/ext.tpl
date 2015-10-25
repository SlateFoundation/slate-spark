{extends app/spark-ext.tpl}

{block meta}
    {capture assign=title}Spark Student &mdash; {Site::$title|escape}{/capture}
    {$dwoo.parent}
{/block}