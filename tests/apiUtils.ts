export class ApiUtils {
  private static readonly GRAPHQL_ENDPOINT = 'https://api-qa.tabski.com/graphql';
  private static readonly MERCHANT_ID = 'cmi7gj9ry001foba4lc73abyx';

  static async getMarijanaCategories(request: any) {
    const listResponse = await request.post(this.GRAPHQL_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        'x-app': 'REPORTING',
      },
      data: {
        operationName: 'getCategories',
        query: `query getCategories($merchantId: ID!, $pagination: Boolean) { 
                  menuCategories(merchantId: $merchantId, pagination: $pagination) { 
                    items { id name menuItems { id } } 
                  } 
                }`,
        variables: {
          merchantId: this.MERCHANT_ID,
          pagination: false,
        },
      },
    });

    const body = await listResponse.json();
    const items = body.data?.menuCategories?.items || [];

    return items.filter(
      (c: any) => c.name && c.name.toLowerCase().includes('test-kategorija-marijana')
    );
  }

  static async unassignAllItems(
    request: any,
    token: string,
    categoryId: string,
    categoryName: string,
    itemIds: string[]
  ) {
    if (itemIds.length === 0) return true; // nema šta da se uklanja

    const response = await request.post(this.GRAPHQL_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        'x-app': 'REPORTING',
        Authorization: `Bearer ${token}`,
      },
      data: {
        operationName: 'updateCategory',
        query: `fragment MenuCategory on MenuCategory {
                  id
                  name
                  externalId
                  externalName
                  enabled
                  menuItems { id name order __typename }
                  menus { id name __typename }
                  __typename
                }

                mutation updateCategory($id: ID!, $input: UpdateMenuCategoryInput!) {
                  updateMenuCategory(id: $id, input: $input) {
                    ...MenuCategory
                    __typename
                  }
                }`,
        variables: {
          id: categoryId,
          input: {
            name: categoryName,
            menuIds: [],
            items: [],
            deletedItemIds: itemIds,
            deletedMenuIds: [],
          },
        },
      },
    });

    const body = await response.json();

    if (body.errors) {
      console.error(
        `Greška pri uklanjanju item-a iz kategorije ${categoryId}:`,
        body.errors[0].message
      );
      return false;
    }

    return true;
  }

  static async deleteCategoryById(request: any, token: string, id: string) {
    const response = await request.post(this.GRAPHQL_ENDPOINT, {
      headers: {
        'Content-Type': 'application/json',
        'x-app': 'REPORTING',
        Authorization: `Bearer ${token}`,
      },
      data: {
        operationName: 'deleteMenuCategory',
        query: `mutation deleteMenuCategory($id: ID!) { deleteMenuCategory(id: $id) { id } }`,
        variables: { id: id },
      },
    });

    const body = await response.json();

    if (body.errors) {
      const isNotEmpty = body.errors[0].message.includes('attached menu items');
      if (isNotEmpty) {
        console.log(`Preskačem brisanje kategorije ${id}: Ima dodeljenih item-a.`);
      } else {
        console.error(`Greška pri brisanju kategorije ${id}:`, body.errors[0].message);
      }
      return false;
    }

    return response.ok() && body.data?.deleteMenuCategory !== null;
  }

  static async cleanupMarijanaCategories(request: any, token: string) {
    const toDelete = await this.getMarijanaCategories(request);
    console.log(`Pronađeno za brisanje: ${toDelete.length}`);

    const deletedNames: string[] = [];
    const failedNames: string[] = [];

    for (const cat of toDelete) {
      const itemIds = (cat.menuItems || []).map((item: any) => item.id);

      if (itemIds.length > 0) {
        console.log(`Uklanjam ${itemIds.length} item-a iz kategorije "${cat.name}"`);
        await this.unassignAllItems(request, token, cat.id, cat.name, itemIds);
      }

      const success = await this.deleteCategoryById(request, token, cat.id);
      if (success) {
        deletedNames.push(cat.name);
      } else {
        failedNames.push(cat.name);
      }
    }

    console.log(`--- CLEANUP ZAVRŠEN. Ukupno obrisano: ${deletedNames.length} ---`);
    if (deletedNames.length > 0) {
      console.log('Obrisane kategorije:');
      deletedNames.forEach((name) => console.log(`  ✓ ${name}`));
    }
    if (failedNames.length > 0) {
      console.log('Nije uspelo brisanje za:');
      failedNames.forEach((name) => console.log(`  ✗ ${name}`));
    }

    return deletedNames;
  }
}
