const weeklyKey = "ruanyifengWeekly";
const directoryPath = "https://api.github.com/repos/ruanyf/weekly/contents/docs";


function showWeekly(){
    var contents = $cache.get(weeklyKey);
    if (!!contents){
        displayWeekly(contents)
    }else{
        $http.get({
            url: directoryPath,
            handler: function(resp) {
                contents = resp.data;
                var formatContents = contents.map((item) => {
                    return {
                        markdownPath : item["download_url"],
                        name: item["name"]
                    }
                }).filter(item => 
                    /issue\-\d+\.md/.test(item.name)
                ).map(item => {
                    var index = item.name.match(/\d+/g)[0];
                    return {
                        markdownPath:item.markdownPath,
                        index :  parseInt(index),
                        name : item.name,
                        displayName: `周刊第${index}期`
                    }
                }).sort((a1, a2) => {
                    if(a1.index > a2.index) return -1;
                    return 1;
                })
                $cache.set(weeklyKey, formatContents);
                displayWeekly(formatContents);
            }
        });
    }
}

showWeekly();

function displayWeekly(contents){
    $ui.render({
        props: {
            title: "科技爱好者周刊"
        },
        views: [{
            type: "list",
            props: {
                data: contents.map((item) => item.displayName)
            },
            layout: $layout.fill,
            events: {
                didSelect: function(tableView, indexPath){
                    var index = indexPath.row;
                    var content = $cache.get(contents[index].name);
                    var displayName = contents[index].displayName;
                    if (!!content){
                        displayWeek(displayName, content);
                    }
                    else{
                        var downloadPath = directoryPath + "/" + contents[index].name;
                        $http.get({
                            url: downloadPath,
                            handler: function(resp) {
                                var data = resp.data;
                                var weeklyContent = $text.base64Decode(data['content']);
                                $cache.set(contents[index].name, weeklyContent);
                                displayWeek(displayName, weeklyContent);
                            }
                        });
                    }
                   
                }
            }
        }]
    });
}

function displayWeek(title, content){
    $ui.push({
        props: {
            title: title
        },
        views: [{
            type: "markdown",
            props: {
                content: content
            },
            layout: $layout.fill
        }]
    });
}