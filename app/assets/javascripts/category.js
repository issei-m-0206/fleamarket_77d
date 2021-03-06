$(document).on('turbolinks:load', ()=> {
  $(function(){
    // カテゴリーセレクトボックスのオプションを作成
    function appendOption(category){
      var html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`;
      return html;
    }
    // 子カテゴリーの表示
    function appendChildrenBox(insertHTML){
      var childSelectHtml = '';
      childSelectHtml = `<select class="category__select" id="children_wrapper" name="product[category]">
                          <option value="選択してください" data-category="選択してください">選択してください</option>
                          ${insertHTML}
                        </select>`;
      $('.form__category__select').append(childSelectHtml);
    }
    // 孫カテゴリーの表示
    function appendGrandchildrenBox(insertHTML){
      var grandchildSelectHtml = '';
      grandchildSelectHtml = `<select class="category__select" id="grandchildren_wrapper" name="product[category_id]">
                                <option value="選択してください" data-category="選択してください">選択してください</option>
                                ${insertHTML}
                              </select>`;
      $('.form__category__select').append(grandchildSelectHtml);
    }
      // 親カテゴリー選択後のイベント
    $('#parent_category').on('change', function(){
      var parentCategory = document.getElementById('parent_category').value; 
      if (parentCategory != "選択してください"){ 
        $.ajax({
          url: '/products/get_category_children',
          type: 'GET',
          data: { parent_id: parentCategory },
          dataType: 'json'
        })
        .done(function(children){
          console.log(children);
          // 親が変更されたとき子以下を削除
          $('#children_wrapper').remove(); 
          $('#grandchildren_wrapper').remove();
          var insertHTML = '';
          children.forEach(function(child){
            insertHTML += appendOption(child);
          });
          appendChildrenBox(insertHTML);
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#children_wrapper').remove(); 
        $('#grandchildren_wrapper').remove();
      }
    });
    // JSで追加したhtml要素を認識するため発動すべき対象を指定
    $('.form__category__select').on('change', '#children_wrapper', function(){
      var childId = $('#children_wrapper option:selected').data('category'); 
      if (childId != "選択してください"){ 
        $.ajax({
          url: '/products/get_category_grandchildren',
          type: 'GET',
          data: { child_id: childId },
          dataType: 'json'
        })
        .done(function(grandchildren){
          console.log(grandchildren);
          if (grandchildren.length != 0) {
            // 子が変更されたとき孫以下を削除
            $('#grandchildren_wrapper').remove(); 
            var insertHTML = '';
            grandchildren.forEach(function(grandchild){
              insertHTML += appendOption(grandchild);
            });
            appendGrandchildrenBox(insertHTML);
          }
        })
        .fail(function(){
          alert('カテゴリー取得に失敗しました');
        })
      }else{
        $('#grandchildren_wrapper').remove(); 
      }
    });
  });
});
