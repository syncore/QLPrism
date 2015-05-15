scr_meta=<><![CDATA[
// ==UserScript==
// @name QL Messenger
// @version 0.3
// @namespace qlprism.us
// @description Embeds QLM into QL site
// @author syncore
// @include http://*.quakelive.com/*
// @exclude http://*.quakelive.com/forum*
// ==/UserScript==
]]></>.toString();

var $ = unsafeWindow.jQuery;
var quakelive = unsafeWindow.quakelive;


// Don't bother if Quake Live is down for maintenance  or not on top
// wn (http://userscripts.org/scripts/show/73076)
if (new RegExp("offline", "i").test(document.title)
    || window.self != window.top) {
return;
}

(function(){

  document.addEventListener('load', function(){

    // don't want QLM button and link to show for users who aren't logged in
      if (!quakelive.IsLoggedIn())
       {
      return;
      }


function replacelinks()
{
  var button = document.getElementById('btn_welcome');
  button.id = "btn_qlm";
  // button image
  button.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAA5CAYAAAAMa7SWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCNDg2RjZFNkU1NkNFMjExQUMyQ0Q5MzVCODVDRjgwMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4MTA5M0UxNjZDRTkxMUUyQjIyMjgyQkZCRjkxQTNFQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MTA5M0UxNTZDRTkxMUUyQjIyMjgyQkZCRjkxQTNFQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJDODZGNkU2RTU2Q0UyMTFBQzJDRDkzNUI4NUNGODAwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI0ODZGNkU2RTU2Q0UyMTFBQzJDRDkzNUI4NUNGODAwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+td6ymQAAFAVJREFUeNrsXAl8FUWa/3e/fu/lAhISIiQIOSAQzhCRW1dAPFBE8BgR1NFhGGecUcZFHRR+e3jLOOoqczi7q4OIjBdzrDIzICzKojIKikIAAYNCQhJykPMdfWxVdVe/6n4vx+NwfWzq/erX1dV1/+v76qv6vleSYRgQ3eyLLzCyeqUhJTkZ3e7b5QxJYk9FlqEbuh0fCquoPdGM195+RxLTSxzcSyadZxTmnRspyAX6t83lDMjHOTm59vvOD7aetaBKkgMzeDweO6zrJk6yLEHTNBxvaLJBZuBOGz/GGDooHyr5aOh6VGFnytEGxevGTJiC62/6HjJ694769u47G/CnV1ejsaEepRMvwO2L72Hxv356BXa8/15Uffc+uAIFg4pYuL6uDkvvuNXx/SdL/wXDR5XY77fPm+34zgfW7VpUoFWToJ8ifdDmpngMpHoliE2XZY+rHZpdl0KAr6k/wQBWaET+wP4IhsMC/X9DVKvHl3zIiNH4wV332O8UkPra4ygYbAJ04fQZ6J3VB089vJx0NtIHGtbou7s+oZt0sgweNgr7Pv+UvfdMz3AAGwtMLcY4UVCTitNRcttgpKQnQyI/A7R+AgC02OzWGnON/EJGEAEjgDa9DY31jTj+UhPUMg2piknBHsKSZSsfJUZHe3Szgxk900ygp04ca+QP6E/KjvScNuibcJoRH7oXXnyZHX7jldV4e93vbSDu+adHkJPbHyNGlyB3YCHrhcDYyADKUfW5oRk76QLs+ewTFp540YwY7TVc+eWoNAEy3iMXFEJJ8UMNUVh19lMNla2TRjsz2mDlawgaIQJsEK0E3DZfEMbcMAL/qsAnafAqHlIO6Zfk4WRqtktV7TVZNcxJcN3M6YaS7FNQW1vLPoYF6tU17cyzZcJC4qlnxOgx5vr68Uf47cpn7DKOVhzDc79YgUeeNONKzp+A/XvL7HyNTc2oqKiIKs8980eMLmVlUVdQNDQqPf/WkfNn5kDy+xAKGLgv7148Vv4YA3ZZ/jIsP7gcDxY+6Ei/7OAyPFT4EJYdWIawEcbjg1dgUdkiwgHCWD3iNcz875nwErC+/voIfF7GaJGckmLn9/l87bZFqa6piUmnp0Og4mv36RLOeKf2EeCOWxOSu7+9/Wcb3BCZpK2BQIRVkrA7vTmBTSr6aPuHGDtuPDKzsjBj1ly889e3Mea8sWbe1lakWPXGKsPdz1wCbksLnTTmxPlZ3s+w5NPlLFx3oo09f7RjSVQZdY1tCOsmBdbWBxBqI4Q2AggekeGl34kc4VNMcKWGBgdOoowkybK1XktQVCpAnTHZ/cys3UY76534XfxMw7HS85iU1DQcJ5M8q08flJ4/Djn9+9tpPvzgfUydNr3dNTZWPxsbVEKtJrjf3bwEL079uUn51Y3s+ctS8332X74f4QpVjdBVM0/TgTDUNhIm1QaOGkgT5YZY4yq+6xG2r+g6EsZxAAYRAUpztfuqudc7+hoFbif9fH/b/2DW7KsxfsJE1FRXs7jD5eWoFNi51sWxqqtVEVBDLFz1VSsueX4R/rboeZwoCwJEbJj61M3ODCSOfjNoBbMouCHoYRPowLFI3XKcWCmakTjg7tq1C9OmT8f5hIX+aPESPPuUSQH9cvrj+7f/0E639b13HfmmzbgE6954tcOy17/9FgOXsuCBeXlmOVvfcwlUXWtnQ42BcJsJTuthFVowZIWD7Ln5p6vstOMX38D8h0+vZe+lt8/Bjl+vY+HR373CFgxp3XKcWEnFhXkJA+/IkjF4YdVqew2sIZRMqWzY8OGR9ZWskbMuvxSVR49g/cbNNlA8LXfP/dvT+PGdi1nePbt349rZV2LL+9vRh3AG7r5z7VxcdfUczF9wE3sfNii/0zbmDymGOn4kW/fDbW2EvQahBoPQyLvRAenTtZOeMVDWbDB2ajBgvURgzGkO44s9nxFpWYlPYKW8PFH8pzt34B8X34XdBAzqKBAisGz9JMD/x+9eYqdXjz3yMMoJaxXTct+LbJ8MYe2l5VPWzB3NR+sT90tdaWNDXS2UvUeg1oQQrA0jWEee9SGE6km4PtiuDzWQNCfIhGgk620z2fG2Ap6gjD4hCcerq7pcv+ilwfkDE4gxC8ePZE87YdIk+/2DbdswtLgY6RkZ9nsFoV7Gli+eYcfHSt9QX49NGzc4yjx44AADd/SYUhQOGsTi3nzt1S61LTP7HPTunQnF6z2lPoZCIcJtqhi4CqFaOc6TQ6kgb6DxDZ02/r9yusVmTcHuZOlHAsWGbm/kkwBJoUdWHlnuRuN0H/bTn+sM+JvcVSYnJ0MuP/yVlNyt3jurnJcsB5/vKbMUBwUF+PLQIQQCbaesyeh2/5fcwgR2cJGpSLH1ubfctMCoI4IFPWILBoPdI5WA1JpNdgS9iYD4u5dWSw5wubvt1lu7aTdB3X++8IJD6oraFU+ueBG9U4HUHhI78vK0I2vJXrMc2VWCpBDJzhP57vFG6vP4ZBiyRPJI9jsrwy+TsBkneYnI7zXfZQ+J83pIHHn3mmklnwcevxUm32haWqfZFtkuW/Z1LiTqId1OR8PcqQENhhp518NE6rWOA7UgCYci2iSNfbPSkjS6dYylhQyyVw1F0oXMeJ3k16y6dJXsRck6yM42hPq0sJXWetI6He1WI99Ye0m4/gQNveDEglPuin+QjOG5QgH0LLOd8ZE8UjToSsRagAPOgRYngw22BQT1Isgm6BID2cwXG2hvSim8PYtYWySSLdDwOgObNoKm5YB3SRK1BpYBQwabA2kPtgCoZgHJAdUDKgOOtpE+dfu76gDUBDgCKvUmMnpMQHVNaJeKiCxk5eOHXYY1meg40DAFef5bRoQtc2CpzpcqMyRBgo8FsBhHC2WAkDhKlXSgKcgGnQCS4QCYgywCTPNJPtmm5I4AhseDHv1vRHbJffAm94lqV2PFH9FU/TSZmJVITp+LrIJHWHzt4fsJ+Osc3IUOXFbh6/CnmSdcarAGlZ9NgRaIUEl28WqkZI63379461wHqLQ90DQbxAiVU8W8hz1jUasIrBYW8zqB1QhGhpWW2xnwvIZw0E0JkSuA6AklB5iN3qBMwlGC4uywgJBY2y0QY1O1bG3QVWFSGJQ1ksrZO2mkoUCgJAPeHkrcFEuP5ZL7XYbciT+PsKO2GoQDVUjOGMHee+bMhuLvi+P75zs7TwaNUyWrR7FYuXAwoPj7wJc6FcHwRov75DqAdQNgA2vIJC7sYr/xAUvHmLJnXYtwEg6saDxC87YHqgm4CV2PVKtPlGopuLG2QI44AXD2LQbQnGrtDsCkZINyCdIRhVAs7YC91ojcgADM2BupiAJssjeS2WdOCPqeUTDPTl/1ybM4Uf6YyaZ95yJ3whr4e+QxQGR5NFlDhUEI0vVPE7iHHvNkIKnn5WirfYeFU7O/E82+LarV7P7JbJ1td03n7NiwZASxx4qZlxOPIUu22kkzLPmDEokLYEO0lNMNG1T7VTUxePkKyVCSyASsa7E0KuHYjQx0YgkTJN/9pJyqVvcMaU/wVuOSAlOsNfyBeea57/6PtmH1T+5kY2GuCkcwcMJSfO+pV8xz4fKZqNi7E/MsncKm15tR9pcDjjJbSRN+vEpDXrHQWv9EPPdTM93CX5Ug09WO1Y+bul1fHAdPdFz4+HTmkjpJkxLnUbVS0XJ6xPCWcIeT+JQayoVRf4rJb44eKLPjOHc5sI3qQ1+x40TdKw2HXdo2KnxzGthHJsuQsZOQnpWNifOWo2zz7zF0rDmRgq0tdr22UKzHNy7i81RcZDK7ZCBXHE+jUCHwdCkOvJ74ATupQ/lO8uvoHFyRr/hT09BwvJqBW1A6Gek5A+00e7ZvxZiLLj3lNp8uF88JokIbnChKIQ5ATmFxFJcYdcUdjgEQto0sHIuriCZJuz/YgslXXoficVPQUGPqT48dPoTjlUciE1JDQjmZzmo1QfzBz3ayRhefPwlTb3/Sjk/OLsLMhXfbndq9bSOaGiKWiiXTZsUsT3R//+ub5rpHWHDfgQUsvGvbZofUoBqJ5RUjgQ4b1//7Exg+fgoD4OpFd+OiuQtQX30M+cNGRYQ/skZW7t+Bpqr9qDz8MPoRoM6beikKN1SxtNz94VePOsre/95awhmeYZyBu+3/tQbjrrwxitITinITxX/9+SasvHchDu3ZxRpPgRCB5ZS3+Pn1SD2nCGtWPEAAPuRIy31Kr0yHmQ0tf9f7W+xyaD5an+5auxPJS7eNQEIqCnr2LcLgcZG/fHyxfQNyikqRmp5pvzce28/CQy+8wY6Plb6FsPC97651lHnsUBmOEnBzR0xD3wJzv/Txn1Ymlgrw5mHOfXG3Ozsc3QExadnbbWVz1rk0L1lz15QZUi9/92CcTS5JAVbutBQHg9OBvfXm8aOqdw9Oojq6vNJjzhGWeGHrc9fNlQx6xny4sfOz5G73LaRWAmqfZKA/IdQ5bxqxzWzW3ezrNrNJTBEKc1YFY194wt3zkmRke+jfMiT2z3DF174oLSvOuxq44l5SBFMa0cyGxBke2Y7j+lyPoM+Fz1QBKX6Zmc1QaU8mvIabw8g+0xpDIuVQxT9NIwkSoTdNOeVhCjerEdMZepxJ9asWO6PxumBmQ81zuMWEQdLo3LKCKtwtMxtRma8J+l2uz5U0XVAjClYZXDHv0uOqYSdmFKf6IDDfMGKD+xQBdUhXBSuCaKz/JNn2S9zcxi874kWwKWA0TDviS41oHDzcnioGyJJlPkOB9uaWwpdbZE+owO43BbsuJ+BdcQw0btYS5npSPS5A2UBze6dQxMxGE8xsaH9pv3VrsnBQHRYZFEzB4oIepOiq+z4O3m5rgpAyaVgEmYH7CAG2xG+dbGi2kQE87Wh5bLWThSK1uPBIiAZSEZTOwgSgnZMsIyxJkaIoWSLAe6mSXgCYq5x6Xjgf2TfdB29GDDObbX9E06anoTdXIHnkNciab5nZrL0fgc8FMxsCPAUsa9Hr8A+wzGxO1KDy0Sk2hVKX/YOXkVIsmNncci4DlQ24Ndgy/dMVpWzRioJbXtBJENRsYEUQI+DpUZTKv4vUzL9RjJhyXjg6EzVgFAcOMBu9YR420SKJNeeTZfJEzxoa8DDDLFP9TkFmM9OtXxQAtjsQ1pCU4TXTC5aKJuU6gaXUIJE60s6/Erl3CmY29TUI11chucAys5k0G0rvfqj57QIYusvMxq0mcp0VK736IGnIdIS/2mKy5KS+DmAZy8/wO6hYrQuyclXBOpGCuMU3ANu9/dDcw3dKy0NKKIiRR8sxtny/E1iLsDTXH4YZXmSwe1rVKpRqh3VBD+u+l4SDLVbgoWY1ngj4fHxZ1wmoPhfAapvOQOezmoJMWZhOSvLS6UIA5gNHKaLXxYKZzdpnceLPjzE2rWQNQM6Sl+Hvl4eUoePgyRjpMP1klCawWs413AevycMuQ2CfaWaTVnp9bNZtAUupUpekqHGhwH4ydtRpu6ro45f8CL0FjP/qCzaGtp2aFhsbHn6Z4KrQfwlVCx+pYUaq9ewYbaAtdjM7eAf4fxnM5b3r5jY03/1vWGY227Zh1bw7ha9HkFexFAtfscxs+s3EkR07Mf828+s7HzVj78ov7KH1mM3Hols0DBC7lD8Bv3ncpJKbrxqNDFcbXvzll1FleKy+BK3njkvOQ+lpvqros48HInPXPnQmErlxk+l/zb8UfLXwdPtKl286CR+yfEdpGlye5/OnWmY2ZWXg98Vwf3Dt2ggbdk0rzcqvCeGQkGYvmSzU9crOxpjly5FUVIQi63+6wZbIcLnL0IS+8Gc4Kcm+quiuvvcgENDR2qbi3n7L0NIWxtKcf3b4FvKNPltbVTQT6fqh/ivQ1BJCU3MYqwpfQ6CZkAAp84ALJ+6/EnyZ9TxqeeVUTHu+qcMsPcZ7uJP0mgvccHvskB4ApKWhoboa6QTcgsmTkT5QMLPZuhVjLrXMbLrY3jNxVRG9eCmW2VlHbVJCSCAzGwuAnOLiqE6NuuMOB7giw1c7AZc+d2/ZgsnXXYfiKVPQUGWZ2Rw6hONHjnRpIB1S+xm4qigcR/02W9aszieCP7jTMrMhLHPqk0/a8cmEjc68WzCz2bgRTcKFYCWzZsUsT3R/f9MysyGsv2+BZWaz2WVm0wXPqLBWRXW1KV3wq4qoY1cVwbyqiPpG8t5oxdFvjXtDFrghtJSbpdlXFZ3EeCmJdNa4/oknMJxQFgXgagLmRQsWoP7YMeSPEsxsyBpZuWMHmvbvR+XDD6MfAeo8wlYLCTXStNz94VGXmQ1ZsxueeYZxBu62r1mDcTfe2IF42A6HOQNXFRmI//IFJZF0BF9v2oSVCxdiztKlKCCAUiBEMDjlLV6/Hr+4/HKseeAB3GgB7E6bkukys6GUSljzhYQ1U1dJWDKtb6wAblfGSg4EEKhQESJbrylLfkjYK2HRwTDG3HI924aVLLg2Zr7R86+xryoafs2VEK8qMoLBKDmiS+CqSCy3h1AY9T0JKx48QzCz2bABOaWlSM3MtFkoTbeM+KE33GDHi+kbCeum8S3kSdOvW7YMn28x7aiOEYmcxm0j1HvIWg66MlZJ5eUIZWahtWcGggRUNRAiWyJ6IxzZCmkdl8DuorI2qvSSEx/Zj/eh5wCkTAPx/k+DmtnQv590q1ROq2sZMgRBermZ/9SsIAzCBVQCrJ8sMVSoikclIvOtkLcbj9Pqkvbtg5d4NcaeOz4lHhEWLVClOLeeKVxxcKckGSe6MTl7Jhfxv+GKA3qjIT0BaT0Jvt7tvj1Oto5A+TXgETOb3j6jpj7Mjq3auscp4Rxl3+nE52V4Macu1I6ZTe9uM5uEdJKEObVOM5v/FWAAOt8CU5UlYd0AAAAASUVORK5CYII%3D)";

  var link = document.getElementById('tn_home').getElementsByTagName('ul')[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0];
  link.innerHTML = "QLM";
  link.id = "qlm_link";

}

function IQLM()
    {

    if (!document.getElementById("qlmind"))
      {

        var qlmind = document.getElementById('qlmind');

        if (qlmind)
        {
          qlmind.parentNode.removeChild(qlmind);
        }


        if ( ( document.getElementById("qlv_welcome") ) && location.hash.match("#!welcome") ) {

        var qlv_welcome = document.getElementById('qlv_welcome');

        var qlm = document.createElement("div");
        qlm.setAttribute('style', 'width:664px');

        qlm.innerHTML = '<center><div onclick="quakelive.mod_friends.Subscribe(\'qlm\');" id="qlmind" style="margin: 0 auto 0 auto; ' +
        'width: 100%;' +
        'border: 1px dotted #5B5555; ' +
        'margin-bottom: 5px; font-size: small; ' +
        'background-color: #A92612; color: #FFFFFF;">' +
        '<p align="center" style="margin: 2px 0 1px 0; cursor: hand; cursor: pointer;"> ' +
        '<b>Click here to add the QLM bot to your Quake Live friends list!</b>' +
        '</p>' +
        '</div>' +
        '<iframe src="http://qlm.qlprism.us/ingame" style="width: 665px; border: 0pt none ;'+
                    'width: 100%;'+
                    'height: 517px;"></iframe></center>';


        $("#qlv_welcome").empty();
        qlv_welcome.parentNode.insertBefore(qlm, qlv_welcome);
      }
    }

  if ( document.getElementById('btn_welcome') && document.getElementById('tn_home') && !document.getElementById('qlm_link') )
  {
    replacelinks();
  }


    }

function ELOB()
    {

      if (!document.getElementById("update_elo"))
      {

        var update_elo = document.getElementById('update_elo');

        if (update_elo)
        {
          update_elo.parentNode.removeChild(update_elo);
        }


        var post_spon_content;
        post_spon_content = document.getElementById('post_spon_content');

        var updatebox = document.createElement("div");
        updatebox.innerHTML = '<div id="update_elo" style="margin: 0; width:300px;' +
        'border: 1px solid #a02a2b; ' +
        'margin-bottom: 0px; font-size: 12px; ' +
        'background-color: #434343; color: #FFFFFF">' +
        '<p align="center" style="font-size: 12px; margin: 0px 0 0px 0;"><b><span onclick="qz_instance.IM_SendMessage(\'qlm@xmpp.quakelive.com\',\'.update\');" style="cursor: hand; cursor: pointer;"> ' +
        'QLM: Update QLRanks Elo ' +
        '</span></b>&nbsp;&nbsp;&nbsp;<img onclick="alert(\'You must first add QLM to your friends list before you can use the Elo updater. Click the blue [+] to add QLM to your friends list.\');" style="margin-top: 2px; cursor: hand; cursor: pointer;" title="Help" alt="Help" src="data:image/gif;base64,R0lGODlhDAAMAJECAOUADf///////wAAACH5BAEAAAIALAAAAAAMAAwAAAIcFI5pwe3XUgQMBmsfvbvmzGnOGE6iiZKVkbRCAQA7"/>&nbsp;&nbsp;&nbsp;<img onclick="quakelive.mod_friends.Subscribe(\'qlm\');" style="margin-top: 2px; cursor: hand; cursor: pointer;" title="Add QLM to friends list" alt="Add QLM to friends list" src="data:image/gif;base64,R0lGODlhDAAMAKIHAMXC/3p3/9za/2pm/+Xj/////ywj/////yH5BAEAAAcALAAAAAAMAAwAAAMyeLbcCiQKEQlYpOgRdCGYNwweaGQbqZnCOCxjwLowZ6LFWIbpfoqd1QIioUQuiobykAAAOw=="/></p></div><br>';

        post_spon_content.parentNode.insertBefore(updatebox, post_spon_content);

      }

    }


        IQLM();
        ELOB();



  }, true);

/* Auto updating */
AnotherAutoUpdater = {

 id: 'ql_messenger',
 days: 0, // Days to wait between update checks
 // Don't edit after this line, unless you know what you're doing ;-)
 name: /\/\/\s*@name\s+(.*)\s*\n/i.exec(scr_meta)[1],
 version: /\/\/\s*@version\s+(.*)\s*\n/i.exec(scr_meta)[1].replace(/\./g, ''),
 time: new Date().getTime(),
 call: function(response) {
    GM_xmlhttpRequest({
      method: 'GET',
    url: 'http://www.qlprism.us/scripts/source/'+this.id+'.meta.js',
    onload: function(xpr) {AnotherAutoUpdater.compare(xpr,response);}
      });
  },
 compare: function(xpr,response) {
    this.xversion=/\/\/\s*@version\s+(.*)\s*\n/i.exec(xpr.responseText);
    this.xname=/\/\/\s*@name\s+(.*)\s*\n/i.exec(xpr.responseText);
    if ( (this.xversion) && (this.xname[1] == this.name) ) {
      this.xversion = this.xversion[1].replace(/\./g, '');
      this.xname = this.xname[1];
    } else {
      if ( (xpr.responseText.match("the page you requested doesn't exist")) || (this.xname[1] != this.name) )
  GM_setValue('updated_'+this.id, 'off');
      return false;
    }
    if ( (+this.xversion > +this.version) && (confirm('A new version of the '+this.xname+' user script is available. Do you want to update?')) ) {
      GM_setValue('updated_'+this.id, this.time+'');
      top.location.href = 'http://www.qlprism.us/scripts/source/'+this.id+'.user.js';
    } else if ( (this.xversion) && (+this.xversion > +this.version) ) {
      if(confirm('Update later?')) {
  GM_log("this does nothing");
  GM_registerMenuCommand("Auto Update "+this.name, function(){GM_setValue('updated_'+this.identi, new Date().getTime()+''); AnotherAutoUpdater.call(true);});
      } else {
  GM_setValue('updated_'+this.id, this.time+'');
      }
    } else {
      if(response) alert('No updates available for '+this.name);
      GM_setValue('updated_'+this.id, this.time+'');
    }
  },
 check: function() {
    if (GM_getValue('updated_'+this.id, 0) == 0) GM_setValue('updated_'+this.id, this.time+'');
    if ( (GM_getValue('updated_'+this.id, 0) != 'off') && (+this.time > (+GM_getValue('updated_'+this.id, 0) + (1000*60*60*24*this.days))) ) {
      this.call();
    } else if (GM_getValue('updated_'+this.id, 0) == 'off') {
      GM_registerMenuCommand("Enable "+this.name+" updates", function(){GM_setValue('updated_'+this.id, new Date().getTime()+'');AnotherAutoUpdater.call(true);});
    } else {
      GM_registerMenuCommand("Check "+this.name+" for updates", function(){GM_setValue('updated_'+this.id, new Date().getTime()+'');AnotherAutoUpdater.call(true);});
    }
    }
};
if (self.location == top.location && typeof GM_xmlhttpRequest != 'undefined') AnotherAutoUpdater.check();
})();


