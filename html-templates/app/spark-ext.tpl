{extends app/ext.tpl}

{block css-loader}
    <style>
        #ext-viewport {
            padding-top: 2.75em;
        }
    </style>
    {include includes/site.css.tpl}
{/block}

{block body}
    {include includes/site.user-tools.tpl}
{/block}