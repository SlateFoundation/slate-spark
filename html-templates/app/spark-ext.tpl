{extends app/ext.tpl}

{block css-loader}
    {if !$.get.iframe}
        <style>
            #ext-viewport {
                padding-top: 2.75em;
            }
        </style>
    {/if}

    {include includes/site.css.tpl}
{/block}

{block body}
    {if !$.get.iframe}
        {include includes/site.user-tools.tpl}
    {/if}
{/block}